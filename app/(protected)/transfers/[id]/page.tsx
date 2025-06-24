"use client"
import { CiEdit } from "react-icons/ci"
import React, { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaCopy } from "react-icons/fa6"
import { GoDownload } from "react-icons/go"
import { IoReturnDownForward } from "react-icons/io5"
import { MdDeleteOutline } from "react-icons/md"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { IoInformationCircle } from "react-icons/io5"
import { CiCircleQuestion } from "react-icons/ci"
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import {formatFileSize} from "@/helper/formatSize"
import { formatDate } from "@/helper/formatDate"
import Link from "next/link"
type File = {
  id: string,
  ownerId: string,
  shareLinkId: string,
  filename: string,
  size: number,
  mime: string,
  url: string,
  createdAt: Date

}
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
const TransfersPage = () => {
  const route = useParams();
  const { id } = route
  
  
  const [copied, setCopied] = useState(false)
  const [data, setData] = useState<ShareLink | null>(null)
  const downloadLink = `/download/${data?.token}`

  const handleCopy = () => {
      navigator.clipboard.writeText(downloadLink) 

  }
  useEffect(() => {
    fetch(`/api/transfers/${id}`)
      .then(res => res.json())
      .then(data => setData(data))
  },[])
  
  
  return (
    <TooltipProvider>
      <div className="container mx-auto">
        
        <div className="flex flex-col justify-start items-start">
          <div className="flex justify-center items-center gap-2 pt-4 sm:pt-8 pb-2">
            
                <h1 className="font-bold text-xl sm:text-2xl lg:text-[30px] break-all">
                  {data?.title}
              </h1>
        
            
            <Tooltip>
              <TooltipTrigger>
                <CiEdit className="text-xl sm:text-2xl lg:text-[30px] flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit title</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2 text-sm sm:text-base lg:text-[18px]">
            <div className="font-light text-gray-400">{data?.files.length}file</div>
            {data && data.files && (
              <div className="font-light text-gray-400">
                • {formatFileSize(data.files.reduce((sum, f) => sum + f.size, 0))}
              </div>
            )}


            {data && data.createdAt && (
              <div className="font-light text-gray-400">
                • Sent {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
              </div>
            )}
          </div>
        </div>


        <div className="flex flex-col justify-start mt-6 sm:mt-10">
          <div className="w-full max-w-none lg:max-w-[70%] dark:bg-[#232323] dark:border-[#444343cd] border-[#f1f1f1f6] border-t-2 border-b-2 shadow-xl p-4 sm:p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-start lg:items-center">
              
              <div className="w-full lg:flex-1 lg:max-w-[600px]">
                {copied ? (
                  <div className="text-sky-300 flex items-center justify-center gap-2 text-center font-semibold text-base sm:text-lg">
                    <IoMdCheckmarkCircleOutline className="text-xl sm:text-[25px] font-bold flex-shrink-0" />
                    Link copied!
                  </div>
                ) : (
                  <div className="flex items-center w-full border rounded-md border-gray-200 bg-white">
                    <Input
                      value={`/download/${data?.token}`}
                      placeholder="https://..."
                      disabled
                      className="dark:text-black dark:bg-black-300 flex-grow rounded-l-md h-10 sm:h-12 lg:h-[50px] border-2 focus:outline-none px-3 sm:px-4 py-2 text-sm sm:text-base"
                    />
                    <div className="flex items-center px-2 sm:px-3">
                      <Button className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1" onClick={handleCopy}>
												<FaCopy className="mr-1 sm:mr-2 text-sm sm:text-[18px]" />
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              
              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 w-full lg:w-auto justify-center lg:justify-end">
                <Link href={downloadLink}  className="flex flex-col items-center text-center hover:opacity-70 transition-opacity">
                  <GoDownload className="text-lg sm:text-xl font-semibold mb-1" />
                  <span className="text-xs sm:text-sm">Download</span>
                </Link>
                <a href="#" className="flex flex-col items-center text-center hover:opacity-70 transition-opacity">
                  <IoReturnDownForward className="text-lg sm:text-xl font-semibold mb-1" />
                  <span className="text-xs sm:text-sm">Forward</span>
                </a>
                <a href="#" className="flex flex-col items-center text-center hover:opacity-70 transition-opacity">
                  <MdDeleteOutline className="text-lg sm:text-xl font-semibold mb-1" />
                  <span className="text-xs sm:text-sm">Delete</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        
        <div className="w-full max-w-none lg:max-w-[70%] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-6">
        
          <div className="py-4 sm:py-6 lg:py-10">

            <div className="mb-6 sm:mb-8">
              <div className="mb-2 flex gap-2 items-center flex-wrap">
                <span className="text-xl sm:text-2xl lg:text-[30px] text-gray-700 font-bold dark:text-white">
                  Expiration date
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <IoInformationCircle className="dark:text-white text-gray-700 text-xl sm:text-2xl lg:text-[27px] flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      When this transfer expires, the files will be deleted and the link will no longer work.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-red-600 mt-2 mb-2 text-base sm:text-lg lg:text-[19px]">{formatDate(data?.expiredAt || "")}</div>
              <div className="flex gap-2 items-start">
                <div className="text-gray-700 dark:text-white text-sm sm:text-base">Transfer is recoverable</div>
                <Tooltip>
                  <TooltipTrigger>
                    <CiCircleQuestion className="text-lg sm:text-xl flex-shrink-0 mt-0.5" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Ultimate or Teams or Enterprise users can access the file even after it expires. Transfers will
                      remain available for an extended period before being permanently deleted.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>


            <div className="pt-4 sm:pt-6 lg:pt-10">
              <div className="flex gap-2 items-center flex-wrap mb-2">
                <span className="dark:text-white text-gray-700 text-xl sm:text-2xl lg:text-[28px] font-bold">
                  Password
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <IoInformationCircle className="text-xl sm:text-2xl lg:text-[27px] text-gray-700 dark:text-white flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm text-center">Set a password to control who has access to this transfer.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="pt-2">
                <a
                  href="#"
                  className="dark:text-white underline text-gray-700 text-base sm:text-lg hover:opacity-70 transition-opacity"
                >
                  Set password
                </a>
              </div>
            </div>
          </div>

         
          <div className="py-4 sm:py-6 lg:py-10">
            <div className="font-semibold text-gray-700 dark:text-white mb-3 text-base sm:text-lg">{data?.files.length} file</div>
            {data?.files.map((item) => (
              <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <div className="bg-gray-100 dark:bg-gray-800 cursor-pointer rounded-xl p-3 sm:p-4 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-700 dark:text-white font-medium text-sm sm:text-base truncate">
                      {item.filename}
                    </div>
                    {item.size && (
                  <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{formatFileSize(item.size)} • {item.mime} </div>
                  )}
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400 rounded-full p-2 ml-3 flex-shrink-0">
                    <GoDownload className="text-sm sm:text-base" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{item.filename}</p>
              </TooltipContent>
            </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default TransfersPage
