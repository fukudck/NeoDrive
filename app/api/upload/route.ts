import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
// import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await auth();
  const data = await req.formData();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    //Get password
    const password = data.get('password')?.toString();
    let passwordHash: string | null = null;
    if (password && password.length > 0) {
      const saltRounds = 10;
      passwordHash = await bcrypt.hash(password, saltRounds);
    }

    // Get ExpiredOption
    const expiredOption = data.get('expiredOption')?.toString()?.toLowerCase();
    let expiredAt: Date | null = null;

    if (!expiredOption) {
      return NextResponse.json({ error: 'Missing expiration option' }, { status: 400 });
    }

    if (expiredOption === 'never') {
      expiredAt = null;
    } else {
      const days = parseInt(expiredOption);
      if (isNaN(days) || ![1, 3, 7, 14, 30].includes(days)) {
        return NextResponse.json({ error: 'Invalid expiration option' }, { status: 400 });
      }
      expiredAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    // Get Title, message
    let title = data.get('title')?.toString()?.trim();
    if (!title || title.length === 0) {
      title = 'Unnamed';
    }

    const message = data.get('message')?.toString()?.trim() || null;

    const maxDownloadsRaw = data.get('maxDownloads')?.toString();
    let maxDownloads: number | null = null;

    if (maxDownloadsRaw) {
      const parsed = parseInt(maxDownloadsRaw);
      if (!isNaN(parsed) && parsed > 0) {
        maxDownloads = parsed;
      } else {
        return NextResponse.json({ error: 'Invalid maxDownloads' }, { status: 400 });
      }
    } else {
      maxDownloads = null; // 👈 Không gửi field → không giới hạn
    }


    // Create dir
    const folderUUID = uuidv4();
    const shareLink = await prisma.shareLink.create({
      data: {
        token: folderUUID,
        expiredAt: expiredAt ?? undefined,
        passwordHash,
        creator: { connect: { id: session.user!.id } },
        title,
        message,
        maxDownloads // 👈 có thể là số hoặc null
      }
    });
    const uploadDir = path.join(process.cwd(), 'uploads', folderUUID);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get Files
    const savedFiles = [];
    const files = data.getAll('file') as File[];
    if (files.length === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
    
  
      const filePath = path.join(uploadDir, file.name);
      await writeFile(filePath, buffer);
    
      const url = `/uploads/${folderUUID}/${file.name}`;
      savedFiles.push(url);
    
      await prisma.file.create({
        data: {
          filename: file.name ?? 'unknown',
          size: file.size,
          mime: file.type ?? 'application/octet-stream',
          url: url,
          ownerId: session.user!.id, 
          shareLinkId: shareLink.id
        },
      });      
    }


    return NextResponse.json({
      message: 'Upload thành công',
      uploadedBy: session.user?.id,
      downloadLink: `/download/${shareLink.token}`,
      expiredAt
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
