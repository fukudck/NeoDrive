import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function GET(
  request: Request,
  context: { params: { token: string } }
) {
  const { token } = await context.params

  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get("password")

    const shareLink = await prisma.shareLink.findUnique({
      where: {
        token: token,
      },
      include: {
        files: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!shareLink) {
      return NextResponse.json({ error: "Share link not found" }, { status: 404 })
    }

    // Check if expired
    const isExpired = shareLink.expiredAt ? new Date() > shareLink.expiredAt : false
    if (isExpired) {
      return NextResponse.json({ error: "Share link has expired" }, { status: 410 })
    }

    // Check max downloads
    if (shareLink.maxDownloads && shareLink.downloadsCount >= shareLink.maxDownloads) {
      return NextResponse.json({ error: "Download limit reached" }, { status: 410 })
    }

    // Check password if required
    if (shareLink.passwordHash) {
      if (!password) {
        return NextResponse.json({ error: "Password required", requiresPassword: true }, { status: 401 })
      }

      const isValidPassword = await bcrypt.compare(password, shareLink.passwordHash)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Invalid password", requiresPassword: true }, { status: 401 })
      }
    }

    const totalSize = shareLink.files.reduce((sum, file) => sum + file.size, 0)

    const shareData = {
      id: shareLink.id,
      title: shareLink.title,
      message: shareLink.message,
      createdAt: shareLink.createdAt,
      expiredAt: shareLink.expiredAt,
      maxDownloads: shareLink.maxDownloads,
      downloadsCount: shareLink.downloadsCount,
      totalSize: formatFileSize(totalSize),
      fileCount: shareLink.files.length,
      creator: shareLink.creator,
      files: shareLink.files.map((file) => ({
        id: file.id,
        filename: file.filename,
        size: formatFileSize(file.size),
        sizeBytes: file.size,
        mime: file.mime,
        url: file.url,
        createdAt: file.createdAt,
      })),
    }

    return NextResponse.json(shareData)
  } catch (error) {
    console.error("Error fetching share link:", error)
    return NextResponse.json({ error: "Failed to fetch share link" }, { status: 500 })
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}
