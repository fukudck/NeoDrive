import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const params = await context.params;
  const token = params.token;
  const fileId = req.nextUrl.searchParams.get('fileId');
  const password = req.nextUrl.searchParams.get('password') || '';
  const session = await auth();
  const user_id = session?.user?.id ?? '0';

  const shareLink = await prisma.shareLink.findUnique({
    where: { id: token },
    include: { files: true }
  });

  if (!shareLink) {
    return NextResponse.json({ error: 'Link không tồn tại' }, { status: 404 });
  }

  if (shareLink.expiredAt && new Date() > shareLink.expiredAt) {
    return NextResponse.json({ error: 'Link đã hết hạn' }, { status: 410 });
  }

  if (shareLink.passwordHash) {
    const valid = await bcrypt.compare(password, shareLink.passwordHash);
    if (!valid && user_id !== shareLink.creatorId) {
      return NextResponse.json({ error: 'Sai mật khẩu hoặc chưa nhập' }, { status: 401 });
    }
  }

  if (
    shareLink.maxDownloads !== null &&
    shareLink.downloadsCount >= shareLink.maxDownloads
  ) {
    return NextResponse.json({ error: 'Link đã đạt giới hạn tải' }, { status: 403 });
  }

  const files = shareLink.files;
  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'Không có file' }, { status: 404 });
  }

  // ✅ Nếu có nhiều file thì bắt buộc phải có fileId
  if (files.length > 1 && !fileId) {
    return NextResponse.json({ error: 'Yêu cầu phải chọn file cụ thể' }, { status: 400 });
  }

  const file = files.length === 1
    ? files[0]
    : files.find(f => f.id === fileId);

  if (!file) {
    return NextResponse.json({ error: 'File không tồn tại' }, { status: 404 });
  }

  const res = await fetch(file.url);
  if (!res.ok || !res.body) {
    return NextResponse.json({ error: 'Không thể tải file từ UploadThing' }, { status: 502 });
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  await prisma.shareLink.update({
    where: { id: shareLink.id },
    data: { downloadsCount: { increment: 1 } }
  });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': file.mime,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`
    }
  });
}
