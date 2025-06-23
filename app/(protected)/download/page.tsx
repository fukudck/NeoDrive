// "use client"
// import React from 'react'
// import { LuDownload } from "react-icons/lu";
// import { MdOutlineDownloadForOffline } from "react-icons/md";
// import { GoReport } from "react-icons/go";
// import { Button } from '@/components/ui/button';
// import { FaCheckCircle } from "react-icons/fa";

// const DownloadPage = () => {
//   const [isDownloaded, setIsDownloaded] = React.useState(false)

//   const handleDownload = () => {
//     setIsDownloaded(true)
//   }

//   return (
//     <section>
//       <div className='container pt-5'>
//         <div className='bg-white shadow-xl border-t-2 border-l-2 h-[400px] w-[259px] rounded-xl flex flex-col'>

//           <div className='px-5 py-7 overflow-y-auto flex-1'>
//             <div className='rounded-full bg-gray-100 w-[150px] h-[150px] mx-auto flex items-center justify-center'>
// 							{isDownloaded ? (
// 								<FaCheckCircle  className="text-[40px] text-green-500" />
// 							) : (
// 								 <MdOutlineDownloadForOffline className="text-[40px]" />
// 							)}
//             </div>
// 						{isDownloaded ? (
// 							<div className='text-center p-5 text-[20px] font-semibold'>Your download has started</div>
// 						) : (
// 							<div className='flex flex-col items-center justify-center mb-2'>
//               <div className='text-[20px] font-semibold mt-3 text-center'>Your files are ready</div>
//               <p className='text-[15px] text-gray-400 text-center truncate'>
//                 Transfer expires in about 24 hours
//               </p>
//             </div>
// 						)}
//             <div className='flex justify-between items-center w-full bg-[#E7E7E7] px-2 py-2 rounded-md'>
//               <div className='left flex flex-col'>
//                 <p className='text-[16px] text-start'>2.png</p>
//                 <h5 className='text-gray-500 text-[15px]'>19KB</h5>
//               </div>
//               <div className='right'>
// 								{isDownloaded ? (
// 									<FaCheckCircle  className="text-[20px] text-green-500" />
// 								) : (
// 									<MdOutlineDownloadForOffline className='text-[25px] text-sky-400' />
// 								)}

//               </div>
//             </div>

//             <div className='w-full flex items-center gap-2 mt-4 text-[14px] text-gray-400'>
//               <GoReport className='text-[20px]' />
//               Report this transfer
//             </div>
//           </div>

//           <div className='w-full p-4 border-t bg-white'>
//             <Button
//               variant={'submit'}
//               className='w-full'
//               onClick={handleDownload}
//             >
//               {isDownloaded ? "Send a file?" : "Submit"}
//             </Button>
//           </div>

//         </div>
//       </div>
//     </section>
//   )
// }

// export default DownloadPage


"use client"

import React from "react"
import { MdOutlineDownloadForOffline } from "react-icons/md"
import { GoReport } from "react-icons/go"
import { Button } from "@/components/ui/button"
import { FaCheckCircle } from "react-icons/fa"
import { icons } from "lucide-react"

const DownloadPage = () => {
  const [isDownloaded, setIsDownloaded] = React.useState(false)

  const handleDownload = () => {
    setIsDownloaded(true)
  }

  return (
    <section className=" bg-white dark:bg-[#0C0A09] flex items-center justify-center">
      <div className="container pt-5">
        <div className="bg-white dark:bg-[#303030] shadow-xl border-t-2 border-l-2 h-[450px] w-[350px] mx-auto rounded-xl flex flex-col">
          <div className="px-6 py-7 overflow-y-auto flex-1">
            {/* Icon and Status */}
            <div className="rounded-full bg-gray-100 dark:bg-white/100 w-[160px] h-[160px] mx-auto flex items-center justify-center mb-6">
              {isDownloaded ? (
                <FaCheckCircle className="text-[45px] text-black" />
              ) : (
                <MdOutlineDownloadForOffline className="text-[45px] text-gray-600" />
              )}
            </div>

            {/* Title and Description */}
            {isDownloaded ? (
              <div className="text-center mb-6">
                <div className="text-[22px] font-semibold text-black mb-2 dark:text-white">Your download has started</div>
                <p className="text-[15px] text-gray-500">Files are being downloaded to your device</p>
              </div>
            ) : (
              <div className="text-center mb-6">
                <div className="text-[22px] font-semibold text-gray-800 mb-2 dark:text-white">Your files are ready</div>
                <p className="text-[15px] text-gray-400">Transfer expires in about 24 hours</p>
              </div>
            )}

            {/* File List */}
            <div className="space-y-3 mb-6">
              {/* File 1 */}
              <div className="flex justify-between items-center w-full bg-gray-50 px-4 py-3 rounded-lg border">
                <div className="flex flex-col">
                  <p className="text-[16px] font-medium text-gray-800">N.png</p>
                  <p className="text-[13px] text-gray-500">Image file</p>
                </div>
                <div className="flex items-center">
                  {isDownloaded ? (
                    <FaCheckCircle className="text-[20px] text-black" />
                  ) : (
                    <MdOutlineDownloadForOffline className="text-[24px] text-blue-500" />
                  )}
                </div>
              </div>

              {/* File 2 */}
              <div className="flex justify-between items-center w-full bg-gray-50 px-4 py-3 rounded-lg border">
                <div className="flex flex-col">
                  <p className="text-[16px] font-medium text-gray-800">2.png</p>
                  <p className="text-[13px] text-gray-500">19KB • Image file</p>
                </div>
                <div className="flex items-center">
                  {isDownloaded ? (
                    <FaCheckCircle className="text-[20px] text-black" />
                  ) : (
                    <MdOutlineDownloadForOffline className="text-[24px] text-blue-500" />
                  )}
                </div>
              </div>

              {/* File 3 */}
              <div className="flex justify-between items-center w-full bg-gray-50 px-4 py-3 rounded-lg border">
                <div className="flex flex-col">
                  <p className="text-[16px] font-medium text-gray-800">document.pdf</p>
                  <p className="text-[13px] text-gray-500">2.4MB • PDF file</p>
                </div>
                <div className="flex items-center">
                  {isDownloaded ? (
                    <FaCheckCircle className="text-[20px] text-black" />
                  ) : (
                    <MdOutlineDownloadForOffline className="text-[24px] text-blue-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Report Section */}
            <div className="w-full flex items-center justify-center gap-2 text-[14px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <GoReport className="text-[18px]" />
              <span>Report this transfer</span>
            </div>
          </div>

          {/* Fixed Button Area */}
          <div className="w-full p-6 border-t bg-white dark:bg-[#303030] rounded-b-xl">
            <Button
							variant={'default'}
              className="w-full h-12 text-[16px] font-medium rounded-lg transition-colors"
              onClick={handleDownload}
            >
              {isDownloaded ? (
								<FaCheckCircle className="w-full"/>
							) : "Download"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadPage
