import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from '@/auth';

export async function GET(request: Request) {
  try {

    const session = await auth();
    const userId = session?.user?.id ?? null; 

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const shareLinks = await prisma.shareLink.findMany({
      where: {
        creatorId: userId,
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
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform data to match frontend interface
    const transfers = shareLinks.map((shareLink) => {
      const totalSize = shareLink.files.reduce((sum, file) => sum + file.size, 0)
      const isExpired = shareLink.expiredAt ? new Date() > shareLink.expiredAt : false

      return {
        id: shareLink.id,
        name: shareLink.title,
        size: formatFileSize(totalSize),
        fileCount: shareLink.files.length,
        date: `Sent ${formatDate(shareLink.createdAt)}`,
        status: shareLink.downloadsCount > 0 ? "downloaded" : "not-downloaded",
        isExpired,
        token: shareLink.token,
        createdAt: shareLink.createdAt,
      }
    })

    return NextResponse.json(transfers)
  } catch (error) {
    console.error("Error fetching transfers:", error)
    return NextResponse.json({ error: "Failed to fetch transfers" }, { status: 500 })
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
