import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET(req: Request, { params }: { params: {id : string}}){
	console.log(params.id);
	try {
		const record = await prisma.shareLink.findUnique({
			where: {
				id: params.id
			},
			include: {
				files: true
			}

		})
		return NextResponse.json(record)
	} catch (error) {
		return NextResponse.json("error")
	}
}
export async function DELETE(req: Request, { params } : { params: {id : string}}) {
	try {
		await prisma.file.deleteMany({
			where: {
				shareLinkId: params.id
			}
		})
		const deleted = await prisma.shareLink.delete({
			where: {
				id: params.id
			}
		})
		return NextResponse.json({ success: true, deleted });
	} catch (error) {
		return NextResponse.json({ success: false, error: "Error" }, { status: 500 });
	}
	
}