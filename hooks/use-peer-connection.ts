"use client"

import { useState, useRef, useCallback } from "react"
import { PeerManager, type ConnectedPeer } from "@/lib/peer-manager"

export interface FileTransfer {
  id: string
  name: string
  size: number
  progress: number
  status: "pending" | "transferring" | "completed" | "failed"
  type: "upload" | "download"
  targetPeer?: string
  file?: File
}

export function usePeerConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [myPeerId, setMyPeerId] = useState<string>("")
  const [connectedPeers, setConnectedPeers] = useState<ConnectedPeer[]>([])
  const [connectionStatus, setConnectionStatus] = useState<string>("")
  const [files, setFiles] = useState<FileTransfer[]>([])
  const [isConnecting, setIsConnecting] = useState(false)

  const peerManagerRef = useRef<PeerManager | null>(null)

  const initializePeerManager = useCallback(() => {
    if (peerManagerRef.current) return

    const peerManager = new PeerManager()

    peerManager.onPeerOpen = (id: string) => {
      setMyPeerId(id)
      setIsConnected(true)
    }

    peerManager.onPeerError = (error: any) => {
      console.error("Peer error:", error)
    }

    peerManager.onConnectionOpen = (peerId: string) => {
      const newPeer: ConnectedPeer = {
        id: peerId,
        name: `Peer ${peerId.slice(0, 8)}`,
        status: "online",
        avatar: "👤",
        connection: null,
      }

      setConnectedPeers((prev) => {
        // Remove any existing peer with the same ID and add the new one
        const filtered = prev.filter((p) => p.id !== peerId)
        return [...filtered, newPeer]
      })
    }

    peerManager.onConnectionClose = (peerId: string) => {
      setConnectedPeers((prev) => prev.filter((p) => p.id !== peerId))
    }

    peerManager.onConnectionError = (peerId: string, error: any) => {
      console.error(`Connection error with ${peerId}:`, error)
      setIsConnecting(false)
    }

    peerManager.onFileReceived = (fileId: string, fileName: string, fileSize: number) => {
      const newFileTransfer: FileTransfer = {
        id: fileId,
        name: fileName,
        size: fileSize,
        progress: 0,
        status: "transferring",
        type: "download",
      }

      setFiles((prev) => [...prev, newFileTransfer])
    }

    peerManager.onFileProgress = (fileId: string, progress: number) => {
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
    }

    peerManager.onFileComplete = (fileId: string, blob: Blob, fileName: string) => {
      // Auto-download the file
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed", progress: 100 } : f)))
    }

    peerManager.onStatusUpdate = (message: string) => {
      setConnectionStatus(message)
    }

    peerManagerRef.current = peerManager
  }, [])

  const connect = useCallback(async () => {
    initializePeerManager()
    if (!peerManagerRef.current) return

    try {
      setConnectionStatus("Connecting to PeerJS server...")
      await peerManagerRef.current.connect()
    } catch (error) {
      console.error("Failed to connect:", error)
      setConnectionStatus("Failed to connect to network")
    }
  }, [initializePeerManager])

  const disconnect = useCallback(() => {
    if (peerManagerRef.current) {
      peerManagerRef.current.disconnect()
      peerManagerRef.current = null
    }
    setIsConnected(false)
    setMyPeerId("")
    setConnectedPeers([])
    setConnectionStatus("")
    setFiles([])
  }, [])

  const connectToPeer = useCallback(async (peerId: string) => {
    if (!peerManagerRef.current) return

    setIsConnecting(true)
    try {
      await peerManagerRef.current.connectToPeer(peerId)
    } catch (error) {
      console.error("Failed to connect to peer:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const sendFiles = useCallback(async (fileList: File[], targetPeerId: string) => {
    if (!peerManagerRef.current) return

    // Check if connection exists and is open
    const connectionStatus = peerManagerRef.current.getConnectionStatus(targetPeerId)
    if (!connectionStatus) {
      alert(`No active connection to peer ${targetPeerId}. Please ensure the peer is connected.`)
      return
    }

    const newFiles: FileTransfer[] = fileList.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "pending",
      type: "upload",
      targetPeer: targetPeerId,
      file: file,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Start file transfers
    for (const fileTransfer of newFiles) {
      if (!fileTransfer.file) continue

      try {
        setFiles((prev) => prev.map((f) => (f.id === fileTransfer.id ? { ...f, status: "transferring" } : f)))

        await peerManagerRef.current.sendFile(fileTransfer.file, targetPeerId, fileTransfer.id, (progress) => {
          setFiles((prev) => prev.map((f) => (f.id === fileTransfer.id ? { ...f, progress } : f)))
        })

        setFiles((prev) =>
          prev.map((f) => (f.id === fileTransfer.id ? { ...f, status: "completed", progress: 100 } : f)),
        )
      } catch (error) {
        console.error("File transfer failed:", error)
        setFiles((prev) => prev.map((f) => (f.id === fileTransfer.id ? { ...f, status: "failed" } : f)))
      }
    }
  }, [])

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  return {
    // State
    isConnected,
    myPeerId,
    connectedPeers,
    connectionStatus,
    files,
    isConnecting,

    // Actions
    connect,
    disconnect,
    connectToPeer,
    sendFiles,
    removeFile,
  }
}
