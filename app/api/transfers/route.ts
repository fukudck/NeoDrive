import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(){
	const session = await auth();
	const prisma = new PrismaClient();
	const userId = session?.user?.id;
	const record = await prisma.shareLink.findMany({
		where: {
			creatorId: userId
		},
		include: {
      files: {
				select: {
					id: true,
          filename: true,
          size: true,
          mime: true,
          url: true,
          createdAt: true,
				}
			}
    },
	})
	const email = await prisma.user.findUnique({
		where: {
			id: userId	
		},
		select:{
			email: true
		}
	})

	return NextResponse.json({
		email: email?.email,
		file: record
	})
	
}