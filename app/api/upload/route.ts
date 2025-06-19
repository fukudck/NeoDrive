import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
// import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

import { v4 as uuidv4 } from 'uuid';


const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
  const session = await auth();
  const data = await req.formData();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("User UUID: ", session.user?.id)

    const files = data.getAll('file') as File[];
    if (files.length === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const savedFiles = [];

    const folderUUID = uuidv4();

    console.log("Upload UUID: ", folderUUID)
    const uploadDir = path.join(process.cwd(), 'uploads', folderUUID);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
    
  
      const filePath = path.join(uploadDir, file.name);
      await writeFile(filePath, buffer);
    
      const url = `/uploads/${folderUUID}/${file.name}`;
      savedFiles.push(url);
    
      // await prisma.file.create({
      //   data: {
      //     filename: file.name ?? 'unknown',
      //     size: file.size,
      //     mime: file.type ?? 'application/octet-stream',
      //     url: url,
      //     ownerId: session.user!.id, // dùng ! để nói với TS: "id chắc chắn tồn tại"
      //   },
      // });      
    }


    return NextResponse.json({ message: 'Upload thành công', uploadedBy: session.user?.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
