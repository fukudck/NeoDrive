"use client"

import * as React from "react"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { IoIosSearch } from "react-icons/io";
import Sort from "@/components/auth/sort";


export default function Transfers() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [selected, setSelected] = React.useState(0)
  const tabs = ["Send", "Requested", "Received"]

  // Đồng bộ index khi Carousel cuộn
  React.useEffect(() => {
    if (!api) return

    const onSelect = () => setSelected(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api])

  const handleTabClick = (index: number) => {
    setSelected(index)
    api?.scrollTo(index)
  }

  return (
    <div className="container mx-auto flex justify-between items-center">
      {/* Vùng bên trái: Carousel */}
      <div className="list w-2/3">
        <div className="top">
          <span className="uppercase text-[16px] font-semibold text-[#565656] py-6 block">
            dathuynh1221212@gmail.com
          </span>
          <div>
            <h1 className="text-black text-[30px] font-bold dark:text-white">Transfers</h1>

            <div className="mt-5">
              <div className="flex border-b border-gray-300 w-[100px]">
								<div className="pb-2 mr-4 border-b-2 w-[50px] border-black font-semibold text-xl hover:text-[#111111]">Sent</div>
							</div>
							<div className="mt-10">
								<div className="relative">
									<input type="text" placeholder="Search by title, file name, or email" className="w-full pl-10 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<IoIosSearch className="text-2xl" />
              		</div>
            		</div>
									{/* <div className="mt-20 text-center">
										<div className="text-2xl font-bold">All the transfers you send will appear here</div>
										<div className="text-gray-500 mt-2">Check the download status or edit,</div>
										<div className="text-gray-500">forward or delete them</div>
          				</div> */}
									<div className="flex justify-between items-center">
										<div className="text-[#ABADAE] text-xl py-1 mt-3">June 2025</div>
										<Sort />
									</div>
									<div className="group mt-8 w-full border rounded-md h-[90px] shadow-2xl bg-[#F7F9FA] dark:bg-[#222222] relative overflow-hidden">
									<div className="absolute inset-0 px-6 py-3 transition-all duration-200 dark:group-hover:bg-[#333333] group-hover:opacity-80 group-hover:bg-[#f7f9fa]">
										<div className="text-left justify-start font-semibold text-xl dark:text-white truncate ">AT LAUCHEER.exe</div>
										<div className="text-gray-900 text-sm mt-1 dark:text-white">
											Sent 12 minutes ago <span className="mx-1">•</span> 27.5 MB (1 file) <span className="mx-1">•</span> Not yet downloaded <span className="mx-1">•</span>
											<span>Expires in 24 hours</span>
										</div>
									</div>

									{/* 3 nút khi hover */}
									<div className="absolute right-4 bottom-4 flex gap-2 opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
										<Button variant="fancy" className="bg-black px-4 py-2 rounded shadow text-white text-sm">Download</Button>
										<Button variant="fancy" className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-400 text-sm">Delete</Button>
									</div>
								</div>

							</div>

            </div>
          </div>
        </div>

       
      </div>


      {/* Vùng bên phải: Hiển thị nội dung */}
    </div>
  )
}
