"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Download, File, CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { FileTransfer } from "@/hooks/use-peer-connection"
import type { ConnectedPeer } from "@/lib/peer-manager"

interface FileTransferAreaProps {
  files: FileTransfer[]
  connectedPeers: ConnectedPeer[]
  selectedPeer: string
  onFilesSelected: (files: File[]) => void
  onRemoveFile: (fileId: string) => void
}

export function FileTransferArea({
  files,
  connectedPeers,
  selectedPeer,
  onFilesSelected,
  onRemoveFile,
}: FileTransferAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const droppedFiles = Array.from(e.dataTransfer.files)
      onFilesSelected(droppedFiles)
    },
    [onFilesSelected],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      onFilesSelected(selectedFiles)
    },
    [onFilesSelected],
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-2"
    >
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">File Transfer</h2>

        {/* Drop Zone */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            scale: isDragOver ? 1.02 : 1,
            borderColor: isDragOver ? "#3b82f6" : "#e5e7eb",
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver ? "border-blue-500 bg-blue-50 dark:bg-neutral-800" : ""
          }`}
        >
          <motion.div
            animate={{
              y: isDragOver ? -5 : 0,
              scale: isDragOver ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Upload className="w-12 h-12 mx-auto mb-4" />
          </motion.div>
          <p className="text-lg font-medium mb-2">
            {selectedPeer ? "Drop files here or click to select" : "Select a peer first, then drop files"}
          </p>
          <p className="text-gray-500 mb-4">
            {selectedPeer
              ? `Files will be sent to ${connectedPeers.find((p) => p.id === selectedPeer)?.name}`
              : "Connect to a peer to start transferring files"}
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className=""
            disabled={!selectedPeer}
          >
            Select Files
          </Button>
          <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
        </motion.div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <h3 className="font-medium  mb-3">Transfer Queue</h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className=" rounded-lg p-4 border shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="flex items-center space-x-2 shrink-0">
                            <File className="w-5 h-5 text-blue-500" />
                            {file.type === "download" && <Download className="w-4 h-4 text-green-500" />}
                          </div>
                          <div>
                          <div className="min-w-0">
                            <p className="font-medium truncate ">{file.name}</p></div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>{file.type === "upload" ? "Sending" : "Receiving"}</span>
                              {file.targetPeer && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {file.type === "upload" ? "To" : "From"}:{" "}
                                    {connectedPeers.find((p) => p.id === file.targetPeer)?.name ||
                                      file.targetPeer.slice(0, 8)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.status === "completed" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                          {file.status === "failed" && <AlertCircle className="w-5 h-5 text-red-500" />}
                          <Button size="sm" variant="ghost" onClick={() => onRemoveFile(file.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {file.status !== "pending" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {file.status === "transferring"
                                ? `${file.type === "upload" ? "Sending" : "Receiving"}...`
                                : file.status === "completed"
                                  ? "Completed"
                                  : "Failed"}
                            </span>
                            <span className="text-gray-600">{Math.round(file.progress)}%</span>
                          </div>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              transition={{ duration: 0.3 }}
                              className={`h-full rounded-full ${
                                file.status === "completed"
                                  ? "bg-green-500"
                                  : file.status === "failed"
                                    ? "bg-red-500"
                                    : file.type === "upload"
                                      ? "bg-blue-500"
                                      : "bg-purple-500"
                              }`}
                            />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
