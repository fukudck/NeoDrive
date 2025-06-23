import Peer from "peerjs"

export interface ConnectedPeer {
  id: string
  name: string
  status: "online" | "offline" | "connecting"
  avatar: string
  connection: any
}

export interface FileMessage {
  type: "file-offer" | "file-chunk" | "file-complete" | "file-accept"
  fileId: string
  fileName: string
  fileSize: number
  chunk?: ArrayBuffer
  chunkIndex?: number
  totalChunks?: number
}

export class PeerManager {
  private peer: Peer | null = null
  private connections: Map<string, any> = new Map()
  private receivedChunks: Map<
    string,
    { chunks: ArrayBuffer[]; fileName: string; fileSize: number; totalChunks: number }
  > = new Map()

  // Event callbacks
  public onPeerOpen?: (id: string) => void
  public onPeerError?: (error: any) => void
  public onConnectionOpen?: (peerId: string) => void
  public onConnectionClose?: (peerId: string) => void
  public onConnectionError?: (peerId: string, error: any) => void
  public onFileReceived?: (fileId: string, fileName: string, fileSize: number) => void
  public onFileProgress?: (fileId: string, progress: number) => void
  public onFileComplete?: (fileId: string, blob: Blob, fileName: string) => void
  public onStatusUpdate?: (message: string) => void

  async connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer({
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: process.env.NEXT_PUBLIC_TURN_URL!,
              username: process.env.NEXT_PUBLIC_TURN_USERNAME!,
              credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL!,
            },
          ],
        },
      })
      

      this.peer.on("open", (id) => {
        this.onPeerOpen?.(id)
        this.onStatusUpdate?.("Connected to network")
        resolve(id)
      })

      this.peer.on("connection", (conn) => {
        // When receiving an incoming connection, set it up immediately
        this.setupConnection(conn)

        // Store the connection immediately when it opens
        conn.on("open", () => {
          this.connections.set(conn.peer, conn)
          this.onConnectionOpen?.(conn.peer)
          this.onStatusUpdate?.(`Peer ${conn.peer} connected to you`)
        })
      })

      this.peer.on("error", (error) => {
        this.onPeerError?.(error)
        this.onStatusUpdate?.(`Connection error: ${error.message}`)
        reject(error)
      })
    })
  }

  async connectToPeer(peerId: string): Promise<void> {
    if (!this.peer) throw new Error("Not connected to network")

    return new Promise((resolve, reject) => {
      this.onStatusUpdate?.(`Connecting to ${peerId}...`)

      const conn = this.peer!.connect(peerId)

      const connectionTimeout = setTimeout(() => {
        if (!conn.open) {
          conn.close()
          this.onConnectionError?.(peerId, new Error("Connection timeout"))
          this.onStatusUpdate?.(`Failed to connect to ${peerId} - peer not found`)
          reject(new Error("Connection timeout"))
        }
      }, 10000)

      conn.on("open", () => {
        clearTimeout(connectionTimeout)
        // Store the connection immediately when it opens
        this.connections.set(peerId, conn)
        this.setupConnection(conn)
        this.onConnectionOpen?.(peerId)
        this.onStatusUpdate?.(`Connected to ${peerId}`)
        resolve()
      })

      conn.on("error", (error) => {
        clearTimeout(connectionTimeout)
        this.onConnectionError?.(peerId, error)
        this.onStatusUpdate?.(`Failed to connect to ${peerId}`)
        reject(error)
      })
    })
  }

  private setupConnection(conn: any) {
    conn.on("data", (data: FileMessage) => {
      this.handleIncomingData(data, conn.peer)
    })

    conn.on("close", () => {
      this.connections.delete(conn.peer)
      this.onConnectionClose?.(conn.peer)
      this.onStatusUpdate?.(`Peer ${conn.peer} disconnected`)
    })

    conn.on("error", (error: any) => {
      this.onConnectionError?.(conn.peer, error)
      this.onStatusUpdate?.(`Connection error with ${conn.peer}`)
    })
  }

  async sendFile(
    file: File,
    targetPeerId: string,
    fileId: string,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    const connection = this.connections.get(targetPeerId)
    if (!connection) {
      console.error("Available connections:", Array.from(this.connections.keys()))
      throw new Error(`No connection to target peer: ${targetPeerId}`)
    }

    if (!connection.open) {
      throw new Error(`Connection to ${targetPeerId} is not open`)
    }

    try {
      // Send file offer
      const fileOffer: FileMessage = {
        type: "file-offer",
        fileId: fileId,
        fileName: file.name,
        fileSize: file.size,
      }

      connection.send(fileOffer)

      // Wait for acceptance
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Send file in chunks
      const chunkSize = 16384 // 16KB chunks
      const totalChunks = Math.ceil(file.size / chunkSize)

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)
        const arrayBuffer = await chunk.arrayBuffer()

        const chunkMessage: FileMessage = {
          type: "file-chunk",
          fileId: fileId,
          fileName: file.name,
          fileSize: file.size,
          chunk: arrayBuffer,
          chunkIndex: i,
          totalChunks: totalChunks,
        }

        connection.send(chunkMessage)

        // Update progress
        const progress = ((i + 1) / totalChunks) * 100
        onProgress?.(progress)

        // Small delay to prevent overwhelming
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      // Send completion message
      const completeMessage: FileMessage = {
        type: "file-complete",
        fileId: fileId,
        fileName: file.name,
        fileSize: file.size,
      }

      connection.send(completeMessage)
    } catch (error) {
      throw new Error(`File transfer failed: ${error}`)
    }
  }

  private handleIncomingData(data: FileMessage, fromPeer: string) {
    switch (data.type) {
      case "file-offer":
        // Auto-accept files
        const acceptMessage: FileMessage = {
          type: "file-accept",
          fileId: data.fileId,
          fileName: data.fileName,
          fileSize: data.fileSize,
        }

        const connection = this.connections.get(fromPeer)
        if (connection) {
          connection.send(acceptMessage)
        }

        // Initialize file transfer
        this.onFileReceived?.(data.fileId, data.fileName, data.fileSize)
        this.receivedChunks.set(data.fileId, {
          chunks: [],
          fileName: data.fileName,
          fileSize: data.fileSize,
          totalChunks: 0,
        })
        break

      case "file-chunk":
        if (data.chunk && data.chunkIndex !== undefined && data.totalChunks) {
          const fileData = this.receivedChunks.get(data.fileId)
          if (fileData) {
            fileData.chunks[data.chunkIndex] = data.chunk
            fileData.totalChunks = data.totalChunks

            const progress = ((data.chunkIndex + 1) / data.totalChunks) * 100
            this.onFileProgress?.(data.fileId, progress)
          }
        }
        break

      case "file-complete":
        const completedFileData = this.receivedChunks.get(data.fileId)
        if (completedFileData) {
          // Combine all chunks
          const combinedBuffer = new Uint8Array(completedFileData.fileSize)
          let offset = 0

          for (const chunk of completedFileData.chunks) {
            if (chunk) {
              combinedBuffer.set(new Uint8Array(chunk), offset)
              offset += chunk.byteLength
            }
          }

          const blob = new Blob([combinedBuffer])
          this.onFileComplete?.(data.fileId, blob, completedFileData.fileName)
          this.receivedChunks.delete(data.fileId)
        }
        break
    }
  }

  getConnections(): string[] {
    return Array.from(this.connections.keys())
  }

  getConnectionStatus(peerId: string): boolean {
    const connection = this.connections.get(peerId)
    return connection && connection.open
  }

  isConnected(): boolean {
    return this.peer !== null && !this.peer.destroyed
  }

  disconnect() {
    if (this.peer) {
      this.peer.destroy()
      this.peer = null
    }
    this.connections.clear()
    this.receivedChunks.clear()
  }
}
