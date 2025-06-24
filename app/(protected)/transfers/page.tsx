"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { IoIosSearch } from "react-icons/io";
import Sort from "@/components/auth/sort";
import { toast } from "sonner"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { formatFileSize } from "@/helper/formatSize";
type ShareLink = {
  id: string
  token: string
  title: string
  message?: string
  passwordHash?: string
  expiredAt?: string
  maxDownloads?: number
  downloadsCount: number
  createdAt: string
  files: File[]
}
type File = {
  id: string
  filename: string
  size: number
  mime: string
  url: string
  createdAt: string
}
export default function Transfers() {

  const [data, setData] = React.useState<{ email: string, file: ShareLink[] } | null>(null)
  const [sortValue, setSortValue] = React.useState("newest")
  const [searchQuery, setSearchQuery] = React.useState("")
  React.useEffect(() => {
    fetch(`/api/transfers`)
    .then(res => res.json())
    .then(data => setData(data))
  }, [])

  const sortedLinks = React.useMemo(() => {
  if (!data) return []

  let filtered = [...data.file]

  if (searchQuery.trim()) {
    try {
      const regex = new RegExp(searchQuery, "i")
      filtered = filtered.filter((link) => regex.test(link.title))
    } catch (error) {
      console.error("Invalid regex:", error)
    }
  }

  switch (sortValue) {
    case "newest":
      return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case "oldest":
      return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case "name-asc":
      return filtered.sort((a, b) => a.title.localeCompare(b.title))
    case "name-desc":
      return filtered.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return filtered
  }
}, [data, sortValue, searchQuery])
  
  const handleDelete = async (id: string) => {
  const confirmed = confirm("Bạn có chắc muốn xóa liên kết chia sẻ này?")
  if (!confirmed) return

  try {
    const res = await fetch(`/api/transfers/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      toast.error("Xóa thất bại")
      return
    }

    
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        file: prev.file.filter((link) => link.id !== id), 
      }
    })

    toast.success("🗑️ Đã xóa liên kết chia sẻ thành công!")
  } catch (error) {
    console.error("Lỗi xóa:", error)
    toast.error("Lỗi khi xóa, vui lòng thử lại.")
  }
} 
  const handleDownload = async (token: string, fileid: string, password: string = '') => {
    const query = new URLSearchParams();
    console.log(password);
    
    query.append("fileid", fileid);
    if (password) query.set("password", password);
    const res = await fetch(`/api/download/${token}?${query.toString()}`);
    if (!res.ok) {
      toast.error("Không có password");
      return;
    }

    const blob = await res.blob();
    const contentDisposition = res.headers.get("Content-Disposition");
    const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || "file";

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();

    toast.success("Success!");
  

  }
// const totalSize = data?.file[0].files.reduce((sum, file) => sum + file.size, 0);  
  return (
   
      <div className="container mx-auto flex justify-between items-center">
        <div className="list w-2/3">
          <div className="top">
            <span className="uppercase text-[16px] font-semibold text-[#565656] py-6 block">
              {data?.email ?? "No email"}
            </span>

            <div>
              <h1 className="text-black text-[30px] font-bold dark:text-white">Transfers</h1>

              <div className="mt-5">
                <div className="flex border-b border-gray-300 w-[100px]">
                  <div className="pb-2 mr-4 border-b-2 w-[50px] border-black font-semibold text-xl hover:text-[#111111]">
                    Sent
                  </div>
                </div>

                <div className="mt-10">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, file name, or email"
                      className="w-full pl-10 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoIosSearch className="text-2xl" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-[#ABADAE] text-xl py-1 mt-3">June 2025</div>
                    <Sort value={sortValue} onChange={setSortValue} />
                  </div>

                  {sortedLinks.map((link) => (
                    <div
                      key={link.id}
                      className="group mt-8 w-full border rounded-md h-[90px] shadow-2xl bg-[#F7F9FA] dark:bg-[#222222] relative overflow-hidden"
                    >
                      <Link href={`/transfers/${link.id}`}>
                        <div className="absolute inset-0 px-6 py-3 transition-all duration-200 dark:group-hover:bg-[#333333] group-hover:opacity-80 group-hover:bg-[#f7f9fa]">
                          <div className="text-left justify-start font-semibold text-xl dark:text-white truncate">
                            {link.title}
                          </div>

                          <div className="text-gray-900 text-sm mt-1 dark:text-white">
                            Uploaded on {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                            <span className="mx-1">•</span>
                            {link.files?.length ?? 0} file(s)
                            <span className="mx-1">•</span>
                            {link.downloadsCount} downloads
                            <span className="mx-1">•</span>
                            {formatFileSize(link.files.reduce((sum, f) => sum + f.size, 0))}
                            {link.expiredAt && (
                              <>
                                <span className="mx-1">•</span>
                                Exp: {new Date(link.expiredAt).toLocaleDateString('vi')}
                              </>
                            )}
                            {link.message && (
                              <>
                                <span className="mx-1">• Message</span>
                                "{link.message}"
                              </>
                            )}
                          </div>
                        </div>
                      </Link>

                          <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            
                            <Button
                              onClick={() => handleDownload(link.token, link.files[0].id, link.passwordHash)}
                              variant="fancy"
                              className="bg-black px-4 py-2 rounded shadow text-white text-sm"
                            >
                              Download
                            </Button>

                            <Button
                              onClick={() => handleDelete(link.id)}
                              variant="fancy"
                              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-400 text-sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )

}
