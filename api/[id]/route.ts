import { NextResponse } from "next/server";
const data:any = []
export async function GET(req: Request) {
	return NextResponse.json({
		data
	});
}

export async function POST(req: Request) {
	const body = await req.json();
}