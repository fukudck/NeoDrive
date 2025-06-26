"use client"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Copy, Download, Forward, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface FileDetail {
  id: string
  name: string
  size: string
  fileCount: number
  uploadDate: string
  shareUrl: string
  expirationDate: string
  isRecoverable: boolean
  hasPassword: boolean
  message: string
  totalDownloads: number
  maxDownloads: number | null
  isExpired: boolean
  files: Array<{
    id: string
    name: string
    size: string
    type: string
    url: string
  }>
}

export default function TransferDetailPage({ params }: { params: { id: string } }) {
  const [fileDetail, setFileDetail] = useState<FileDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null) // Declare setError variable
  const router = useRouter()
  const hasFetchedRef = useRef(false)
  const { id } = useParams() as { id: string }

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    fetchTransferDetail()
  }, [id])

  const fetchTransferDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/transfers/${id}`)
      if (response.ok) {
        const data = await response.json()
        setFileDetail(data)
      } else {
        console.error("Failed to fetch transfer detail")
      }
    } catch (error) {
      console.error("Error fetching transfer detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!fileDetail) return

    try {
      await navigator.clipboard.writeText(fileDetail.shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link")
    }
  }

  const handleDownload = async (fileId: string, linkId: string) => {
    const url = `/api/download/${linkId}?fileId=${fileId}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  

  const handleDelete = async () => {
    if (!fileDetail) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/transfers/${fileDetail.id}/delete`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Redirect to main page after successful deletion
        router.push("/transfers")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to delete transfer")
      }
    } catch (err) {
      setError("Failed to delete transfer")
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-32 mb-6"></div>
            <div className="h-12 bg-gray-200 dark:bg-neutral-800 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 dark:bg-neutral-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!fileDetail) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Transfer not found</p>
            <Link href="/transfers" className="text-blue-600 hover:underline mt-4 inline-block">
              Back to Transfers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/transfers" className="inline-flex items-center hover:text-blue-500 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transfers
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-bold">{fileDetail.name}</h1>
            </div>
            <p className="text-gray-600">
              {fileDetail.fileCount} file{fileDetail.fileCount > 1 ? "s" : ""} • {fileDetail.size} •{" "}
              {fileDetail.uploadDate}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
          <Button
            asChild
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white border-0"
          >
            <a
              href={`/api/download/${fileDetail.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
          </Button>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 text-white border-0">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Transfer</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{fileDetail?.name}"? This action cannot be undone and will
                    permanently delete all files and the share link.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    {deleting ? "Deleting..." : "Delete Transfer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Share Link */}
        <div className="rounded-lg border p-6 mb-6">
          <div className="flex items-center space-x-3">
            <Input value={fileDetail.shareUrl} readOnly className="flex-1" />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className={`flex items-center space-x-2 transition-colors ${
                copied
                  ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-1">
            {/* Expiration Date */}
            <div className="rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-lg font-medium">Expiration date</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">{fileDetail.expirationDate}</span>
                {fileDetail.isExpired && (
                  <Badge variant="destructive" className="ml-2">
                    Expired
                  </Badge>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-lg font-medium">Password</h3>
              </div>
              {fileDetail.hasPassword ? (
                <span className="text-green-600">Password protected</span>
              ) : (
                <button className="text-red-600">No Password</button>
              )}
            </div>

            {/* Message */}
            <div className="rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">Message</h3>
              <p className="text-gray-500">{fileDetail.message || "No message"}</p>
            </div>

            {/* Total Downloads */}
            <div className="rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">Total downloads</h3>
              <p className="text-2xl font-bold text-gray-500">
                {fileDetail.totalDownloads}
                {fileDetail.maxDownloads && (
                  <span className="text-sm font-normal text-gray-400"> / {fileDetail.maxDownloads} max</span>
                )}
              </p>
            </div>
          </div>

          {/* Right Column - Files */}
          <div className="lg:col-span-1">
            <div className="rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">
                {fileDetail.fileCount} file{fileDetail.fileCount > 1 ? "s" : ""}
              </h3>
              <div className="space-y-3">
                {fileDetail.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {file.size} • {file.type}
                      </p>
                    </div>
                    <Download
                      className="w-5 h-5 cursor-pointer hover:text-blue-600"
                      onClick={() => handleDownload(file.id, fileDetail.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    </div>
  )
}
