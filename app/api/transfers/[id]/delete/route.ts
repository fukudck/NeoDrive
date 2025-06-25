import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import fs from "fs"
import path from "path"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the share link with files
    const shareLink = await prisma.shareLink.findUnique({
      where: {
        id: params.id,
      },
      include: {
        files: true,
      },
    })

    if (!shareLink) {
      return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
    }

    // Check if user owns this transfer
    if (shareLink.creatorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden - You don't own this transfer" }, { status: 403 })
    }

    // Delete files from filesystem
    const uploadDir = path.join(process.cwd(), "uploads", shareLink.token)
    if (fs.existsSync(uploadDir)) {
      try {
        // Delete all files in the directory
        const files = fs.readdirSync(uploadDir)
        for (const file of files) {
          const filePath = path.join(uploadDir, file)
          fs.unlinkSync(filePath)
        }
        // Remove the directory
        fs.rmdirSync(uploadDir)
      } catch (fsError) {
        console.error("Error deleting files from filesystem:", fsError)
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete files from database first (due to foreign key constraint)
    await prisma.file.deleteMany({
      where: {
        shareLinkId: shareLink.id,
      },
    })

    // Then delete the share link
    await prisma.shareLink.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      message: "Transfer deleted successfully",
      deletedFiles: shareLink.files.length,
    })
  } catch (error) {
    console.error("Error deleting transfer:", error)
    return NextResponse.json({ error: "Failed to delete transfer" }, { status: 500 })
  }
}
