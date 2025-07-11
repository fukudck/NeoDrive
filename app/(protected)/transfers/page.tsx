"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface FileTransfer {
  id: string
  name: string
  size: string
  fileCount: number
  date: string
  status: "downloaded" | "not-downloaded" | "expired"
  isExpired: boolean
  token: string
  createdAt: string
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<FileTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const hasFetchedRef = useRef(false)

  const userId = "0" // Replace with actual user ID from auth

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    fetchTransfers()
  }, [])

  const fetchTransfers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/transfers?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setTransfers(data)
      } else {
        console.error("Failed to fetch transfers")
      }
    } catch (error) {
      console.error("Error fetching transfers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransfers = transfers.filter((transfer) =>
    transfer.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage)
  const paginatedTransfers = filteredTransfers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusIcon = (status: string) => {
    if (status === "downloaded") {
      return <Download className="w-4 h-4 text-green-600" />
    }
    return null
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "downloaded":
        return "Downloaded"
      case "not-downloaded":
        return "Not yet downloaded"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-64 mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-neutral-800 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-neutral-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Transfers</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-8">
            <div className="pb-2 text-lg font-medium border-b-2">Sent</div>
          </div>

        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by title, file name, or email"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // reset page on new search
            }}
            className="pl-10 py-3 text-base border-gray-300 rounded-lg"
          />
        </div>

        {/* File List */}
        <div className="space-y-4 overflow-auto">
          {paginatedTransfers.length > 0 ? (
            paginatedTransfers.map((transfer) => (
              <div key={transfer.id} className="rounded-lg border p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/transfers/${transfer.id}`}>
                      <h3 className="text-lg font-medium mb-2 hover:text-blue-500 cursor-pointer transition-colors">
                        {transfer.name}
                      </h3>
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{transfer.date}</span>
                      <span>•</span>
                      <span>
                        {transfer.size} ({transfer.fileCount} file{transfer.fileCount > 1 ? "s" : ""})
                      </span>
                      {transfer.status !== "expired" && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(transfer.status)}
                            <span>{getStatusText(transfer.status)}</span>
                          </div>
                        </>
                      )}
                      {transfer.isExpired && (
                        <>
                          <span>•</span>
                          <Badge variant="destructive" className="bg-red-200 text-red-700">
                            Expired
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? "No transfers found matching your search" : "No transfers found"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
