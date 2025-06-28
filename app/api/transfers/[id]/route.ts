import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: {
        id: id,
      },
      include: {
        files: true,
        creator: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    })

    if (!shareLink) {
      return NextResponse.json({ error: "Transfer not found" }, { status: 404 })
    }
    
    const totalSize = shareLink.files.reduce((sum, file) => sum + file.size, 0)
    const isExpired = shareLink.expiredAt ? new Date() > shareLink.expiredAt : false
    
    const transferDetail = {
      id: shareLink.id,
      name: shareLink.title,
      size: formatFileSize(totalSize),
      fileCount: shareLink.files.length,
      uploadDate: `Sent ${formatDate(shareLink.createdAt)}`,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/share/${shareLink.token}`,
      expirationDate: shareLink.expiredAt
        ? shareLink.expiredAt.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "No expiration",
      isRecoverable: true,
      hasPassword: !!shareLink.passwordHash,
      message: shareLink.message || "",
      totalDownloads: shareLink.downloadsCount,
      maxDownloads: shareLink.maxDownloads,
      isExpired,
      files: shareLink.files.map((file) => ({
        id: file.id,
        name: file.filename,
        size: formatFileSize(file.size),
        type: file.mime.split("/")[1] || "file",
        url: file.url,
      })),
    }

    return NextResponse.json(transferDetail)
  } catch (error) {
    console.error("Error fetching transfer detail:", error)
    return NextResponse.json({ error: "Failed to fetch transfer detail" }, { status: 500 })
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatDate(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }
}
