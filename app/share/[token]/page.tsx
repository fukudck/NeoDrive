"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Download, Lock, Calendar, User, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useParams } from "next/navigation"

interface ShareData {
  id: string
  title: string
  message: string | null
  createdAt: string
  expiredAt: string | null
  maxDownloads: number | null
  downloadsCount: number
  totalSize: string
  fileCount: number
  creator: {
    name: string | null
    email: string | null
  }
  files: Array<{
    id: string
    filename: string
    size: string
    sizeBytes: number
    mime: string
    url: string
    createdAt: string
  }>
}

export default function SharePage({ params }: { params: { token: string } }) {
  const [shareData, setShareData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const { token } = useParams() as { token: string }

  useEffect(() => {
    fetchShareData()
  }, [token])

  const fetchShareData = async (passwordAttempt?: string) => {
    try {
      setLoading(true)
      setError(null)
      setPasswordError("")

      const url = new URL(`/api/share/${token}`, window.location.origin)
      if (passwordAttempt) {
        url.searchParams.set("password", passwordAttempt)
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (response.ok) {
        setShareData(data)
        setRequiresPassword(false)
        // Store password for downloads
        if (passwordAttempt) {
          setPassword(passwordAttempt)
        }
      } else if (response.status === 401 && data.requiresPassword) {
        setRequiresPassword(true)
        if (passwordAttempt) {
          setPasswordError("Invalid password")
        }
      } else {
        setError(data.error || "Failed to load share")
      }
    } catch (err) {
      setError("Failed to load share")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) {
      fetchShareData(password)
    }
  }

  const handleDownload = async (fileId?: string, filename?: string) => {
    try {
      if (fileId) {
        setDownloadingFiles((prev) => new Set(prev).add(fileId))
      }

      // Build URL with query parameters for your API
      const url = new URL(`/api/download/${token}`, window.location.origin)
      if (fileId) {
        url.searchParams.set("fileId", fileId)
      }
      if (password) {
        url.searchParams.set("password", password)
      }

      const response = await fetch(url.toString())

      if (response.ok) {
        // Get the filename from Content-Disposition header or use provided filename
        const contentDisposition = response.headers.get("Content-Disposition")
        let downloadFilename = filename

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]*)"/)
          if (filenameMatch) {
            downloadFilename = filenameMatch[1]
          }
        }

        // Create blob and download
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = downloadFilename || "download"
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up blob URL
        window.URL.revokeObjectURL(downloadUrl)

        // Update download count in UI
        if (shareData) {
          setShareData({
            ...shareData,
            downloadsCount: shareData.downloadsCount + 1,
          })
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Download failed")
      }
    } catch (err) {
      setError("Download failed")
    } finally {
      if (fileId) {
        setDownloadingFiles((prev) => {
          const newSet = new Set(prev)
          newSet.delete(fileId)
          return newSet
        })
      }
    }
  }

  const handleDownloadAll = async () => {
    if (!shareData) return

    // For multiple files, your API will automatically create a ZIP
    await handleDownload()
  }

  const getFileIcon = (mime: string) => {
    if (mime.startsWith("image/")) return "🖼️"
    if (mime.startsWith("video/")) return "🎥"
    if (mime.startsWith("audio/")) return "🎵"
    if (mime.includes("pdf")) return "📄"
    if (mime.includes("zip") || mime.includes("rar") || mime.includes("7z")) return "📦"
    if (mime.includes("word") || mime.includes("document")) return "📝"
    if (mime.includes("excel") || mime.includes("spreadsheet")) return "📊"
    if (mime.includes("powerpoint") || mime.includes("presentation")) return "📈"
    if (mime.includes("text")) return "📄"
    return "📁"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to Load Share</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <CardTitle>Password Required</CardTitle>
            <p className="text-gray-600">This share is password protected</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? "border-red-500" : ""}
                />
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={!password.trim()}>
                Access Files
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!shareData) return null

  const isExpired = shareData.expiredAt ? new Date() > new Date(shareData.expiredAt) : false
  const isDownloadLimitReached = shareData.maxDownloads ? shareData.downloadsCount >= shareData.maxDownloads : false

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{shareData.title}</CardTitle>
                <div className="flex items-center space-x-4  text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{shareData.creator.name || shareData.creator.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(shareData.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{shareData.totalSize}</p>
                <p className=" text-sm text-gray-600 dark:text-gray-400">
                  {shareData.fileCount} file{shareData.fileCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {shareData.message && (
              <div className="mt-4 p-3  rounded-lg">
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-sm text-gray-600 dark:text-gray-400 mt-1" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">{shareData.message}</p>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Status Alerts */}
        {(isExpired || isDownloadLimitReached) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {isExpired && "This share has expired and is no longer available for download."}
              {isDownloadLimitReached && "The download limit for this share has been reached."}
            </AlertDescription>
          </Alert>
        )}

        {/* Download Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{shareData.downloadsCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 ">Total Downloads</p>
            </CardContent>
          </Card>
          {shareData.maxDownloads && (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">{shareData.maxDownloads}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download Limit</p>
              </CardContent>
            </Card>
          )}
          {shareData.expiredAt && (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium ">Expires</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(shareData.expiredAt)}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Download All Button */}
        {!isExpired && !isDownloadLimitReached && shareData.files.length > 1 && (
          <div className="mb-6">
            <Button onClick={handleDownloadAll} size="lg" className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download All Files ({shareData.totalSize})
            </Button>
          </div>
        )}

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Files ({shareData.fileCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shareData.files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg ">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.mime)}</span>
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-gray-600">{file.size}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(file.id, file.filename)}
                    disabled={isExpired || isDownloadLimitReached || downloadingFiles.has(file.id)}
                    size="sm"
                  >
                    {downloadingFiles.has(file.id) ? (
                      "Downloading..."
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
