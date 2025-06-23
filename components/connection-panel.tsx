"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ConnectedPeer } from "@/lib/peer-manager"

interface ConnectionPanelProps {
  isConnected: boolean
  myPeerId: string
  connectedPeers: ConnectedPeer[]
  connectionStatus: string
  isConnecting: boolean
  selectedPeer: string
  onConnect: () => void
  onDisconnect: () => void
  onConnectToPeer: (peerId: string) => void
  onSelectPeer: (peerId: string) => void
}

export function ConnectionPanel({
  isConnected,
  myPeerId,
  connectedPeers,
  connectionStatus,
  isConnecting,
  selectedPeer,
  onConnect,
  onDisconnect,
  onConnectToPeer,
  onSelectPeer,
}: ConnectionPanelProps) {
  const [peerIdInput, setPeerIdInput] = useState("")

  const handleConnect = () => {
    if (isConnected) {
      onDisconnect()
    } else {
      onConnect()
    }
  }

  const handleConnectToPeer = () => {
    if (peerIdInput.trim()) {
      onConnectToPeer(peerIdInput.trim())
      setPeerIdInput("")
    }
  }

  const copyPeerId = () => {
    navigator.clipboard.writeText(myPeerId)
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Connection</h2>
        </div>

        <Button
          onClick={handleConnect}
          className={`w-full mb-4 ${isConnected ? "bg-red-400 hover:bg-red-500 text-white dark:text-white" : "bg-green-500 hover:bg-green-600 text-white dark:text-white"}`}
        >
          {isConnected ? "Disconnect" : "Connect to Network"}
        </Button>

        {connectionStatus && (
          <div className="mb-4 p-4 border rounded-lg text-sm ">{connectionStatus}</div>
        )}

        {isConnected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            {/* My Peer ID */}
            <div className="py-4 px-4  border  rounded-lg">
              <p className="text-sm font-medium ">Your Peer ID</p>
              <div className="flex items-center space-x-2">
                <code className="text-xs px-2 py-2 my-2 rounded border flex-1 overflow-hidden">{myPeerId}</code>
                <Button size="sm" variant="outline" onClick={copyPeerId} className="text-xs">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs ">Share this ID with others to connect</p>
            </div>

            {/* Connect to Peer */}
            <div className="space-y-2">
              <label className="text-sm font-medium ">Connect to Peer</label>
              <div className="flex space-x-2 py-2">
                <input
                  type="text"
                  value={peerIdInput}
                  onChange={(e) => setPeerIdInput(e.target.value)}
                  placeholder="Enter peer ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleConnectToPeer()}
                />
                <Button onClick={handleConnectToPeer} disabled={!peerIdInput.trim() || isConnecting} size="sm">
                  Connect
                </Button>
              </div>
            </div>

            {/* Connected Peers */}
            {connectedPeers.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium ">Connected Peers</h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {connectedPeers.map((peer, index) => (
                      <motion.div
                        key={peer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedPeer === peer.id
                            ? " border-2 border-green-500"
                            : " border border-green-200 hover:border-green-400"
                        }`}
                        onClick={() => onSelectPeer(peer.id)}
                      >
                        <span className="text-2xl">{peer.avatar}</span>
                        <div className="flex-1">
                          <p className="font-medium">{peer.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{peer.id.slice(0, 16)}...</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedPeer === peer.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-blue-600 text-sm font-medium"
                            >
                              Selected
                            </motion.div>
                          )}
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {selectedPeer && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm  p-2 "
                  >
                    Files will be sent to: {connectedPeers.find((p) => p.id === selectedPeer)?.name}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
