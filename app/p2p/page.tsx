"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Download, File } from "lucide-react"
import { Card } from "@/components/ui/card"
import { usePeerConnection } from "@/hooks/use-peer-connection"
import { ConnectionPanel } from "@/components/connection-panel"
import { FileTransferArea } from "@/components/file-transfer-area"

export default function P2PFileTransfer() {
  const [selectedPeer, setSelectedPeer] = useState<string>("")

  const {
    isConnected,
    myPeerId,
    connectedPeers,
    connectionStatus,
    files,
    isConnecting,
    connect,
    disconnect,
    connectToPeer,
    sendFiles,
    removeFile,
  } = usePeerConnection()

  const handleFilesSelected = (fileList: File[]) => {
    if (!selectedPeer) {
      alert("Please select a peer to send files to")
      return
    }
    sendFiles(fileList, selectedPeer)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Panel */}
          <ConnectionPanel
            isConnected={isConnected}
            myPeerId={myPeerId}
            connectedPeers={connectedPeers}
            connectionStatus={connectionStatus}
            isConnecting={isConnecting}
            selectedPeer={selectedPeer}
            onConnect={connect}
            onDisconnect={disconnect}
            onConnectToPeer={connectToPeer}
            onSelectPeer={setSelectedPeer}
          />

          {/* File Transfer Area */}
          <FileTransferArea
            files={files}
            connectedPeers={connectedPeers}
            selectedPeer={selectedPeer}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={removeFile}
          />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="p-4 text-center">
            <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {files.filter((f) => f.status === "completed" && f.type === "upload").length}
            </p>
            <p className="">Files Sent</p>
          </Card>
          <Card className="p-4 text-center">
            <Download className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold ">
              {files.filter((f) => f.status === "completed" && f.type === "download").length}
            </p>
            <p className="">Files Received</p>
          </Card>
          <Card className="p-4 text-center">
            <File className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold ">
              {(files.reduce((acc, f) => acc + (f.status === "completed" ? f.size : 0), 0) / 1024 / 1024).toFixed(1)}
            </p>
            <p className="">MB Transferred</p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
