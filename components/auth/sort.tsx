"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, ChevronDown } from "lucide-react"

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "name-asc", label: "Tên A-Z" },
  { value: "name-desc", label: "Tên Z-A" },
  { value: "price-low", label: "Giá thấp đến cao" },
  { value: "price-high", label: "Giá cao đến thấp" },
  { value: "popular", label: "Phổ biến nhất" },
  { value: "rating", label: "Đánh giá cao nhất" },
]

export default function Sort() {
  const [sortValue, setSortValue] = useState("newest")
  const getCurrentLabel = () => {
    return sortOptions.find((option) => option.value === sortValue)?.label || "Sắp xếp"
  }

  return (
		<div className="mt-5">
			    <DropdownMenu >
					<DropdownMenuTrigger asChild >
						<Button
							variant="fancy"
							className="h-10 px-4 text-left font-normal border border-gray-300 hover:border-blue-400 transition-color"
						>
							<div className="flex items-center gap-2">
								<ArrowUpDown className="w-4 h-4 text-gray-500" />
								<span className="text-gray-700 dark:text-white">{getCurrentLabel()}</span>
								<ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="min-w-[220px] p-2">
						<DropdownMenuRadioGroup value={sortValue} onValueChange={setSortValue}>
							{sortOptions.map((option) => (
								<DropdownMenuRadioItem
									key={option.value}
									value={option.value}
									className="flex items-center gap-3 px-3 py-2.5 cursor-pointer dark:text-white hover:bg-blue-50 focus:bg-blue-50 rounded-md transition-colors"
								>
									<span className="dark:text-white text-gray-900 ml-5 font-medium">{option.label}</span>
								</DropdownMenuRadioItem>
							))}
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
    		</DropdownMenu>
		</div>

  )
}
