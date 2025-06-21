"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { IconUpload } from "@tabler/icons-react"
import { X, Link } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "../ui/textarea"

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
}

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [linkFormData, setLinkFormData] = useState({
    title: "",
    message: "",
    expirationDays: "7",
    passwordProtected: false,
    password: "",
    allowDownloadLimit: false,
    downloadLimit: "10",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    onChange && onChange([...files, ...newFiles])
  }

  const handleDeleteFile = (indexToDelete: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToDelete)
    setFiles(updatedFiles)
    onChange && onChange(updatedFiles)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleLinkFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating download link with data:", { files, linkFormData })
    // Handle link creation here
  }

  const handleLinkInputChange = (field: string, value: string | boolean) => {
    setLinkFormData((prev) => ({ ...prev, [field]: value }))
  }

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error)
    },
  })

  return (
    <div className="w-full">
      <div
        className={cn(files.length > 0 ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex justify-center items-center")}
      >
        {/* Upload Area */}
        <div className={cn("w-full", files.length === 0 && "max-w-xl mx-auto")} {...getRootProps()}>
          <motion.div
            onClick={handleClick}
            whileHover="animate"
            className="p-10 group/file block rounded-lg cursor-pointer w-full relative"
          >
            <input
              ref={fileInputRef}
              id="file-upload-handle"
              type="file"
              onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center">
              <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                Upload file
              </p>
              <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                Drag or drop your files here or click to upload
              </p>
              <div className="relative w-full mt-10 max-w-xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {files.length > 0 &&
                    files.map((file, idx) => (
                      <motion.div
                        key={"file" + idx}
                        layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                          "shadow-sm",
                        )}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFile(idx)
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <X className="h-4 w-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300" />
                        </button>

                        <div className="flex justify-between w-full items-center gap-4 pr-8">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                          >
                            {file.name}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                          >
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </motion.p>
                        </div>

                        <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                          >
                            {file.type}
                          </motion.p>

                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
                            modified {new Date(file.lastModified).toLocaleDateString()}
                          </motion.p>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>

                <AnimatePresence>
                  {!files.length && (
                    <motion.div
                      layoutId="file-upload"
                      variants={mainVariant}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className={cn(
                        "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                        "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                      )}
                    >
                      {isDragActive ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-neutral-600 flex flex-col items-center"
                        >
                          Drop it
                          <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                        </motion.p>
                      ) : (
                        <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!files.length && (
                  <motion.div
                    variants={secondaryVariant}
                    className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                  ></motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form Area - Create Link Only */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <div
                className="p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 sticky top-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                  Create Download Link
                </h3>
                <form onSubmit={handleLinkFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter a title for this link"
                      value={linkFormData.title}
                      onChange={(e) => handleLinkInputChange("title", e.target.value)}
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Enter a name for this link"
                      value={linkFormData.message}
                      onChange={(e) => handleLinkInputChange("message", e.target.value)}
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiration" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Link Expiration
                    </Label>
                    <Select
                      value={linkFormData.expirationDays}
                      onValueChange={(value) => handleLinkInputChange("expirationDays", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select expiration time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="never">Never Expires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Password Protection
                        </Label>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Require a password to download</p>
                      </div>
                      <Switch
                        checked={linkFormData.passwordProtected}
                        onCheckedChange={(checked) => handleLinkInputChange("passwordProtected", checked)}
                      />
                    </div>

                    {linkFormData.passwordProtected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          value={linkFormData.password}
                          onChange={(e) => handleLinkInputChange("password", e.target.value)}
                          className="w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Download Limit
                        </Label>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Limit the number of downloads</p>
                      </div>
                      <Switch
                        checked={linkFormData.allowDownloadLimit}
                        onCheckedChange={(checked) => handleLinkInputChange("allowDownloadLimit", checked)}
                      />
                    </div>

                    {linkFormData.allowDownloadLimit && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="downloadLimit"
                          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          Maximum Downloads
                        </Label>
                        <Select
                          value={linkFormData.downloadLimit}
                          onValueChange={(value) => handleLinkInputChange("downloadLimit", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select download limit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Download</SelectItem>
                            <SelectItem value="5">5 Downloads</SelectItem>
                            <SelectItem value="10">10 Downloads</SelectItem>
                            <SelectItem value="25">25 Downloads</SelectItem>
                            <SelectItem value="50">50 Downloads</SelectItem>
                            <SelectItem value="100">100 Downloads</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    )}
                  </div>

                  <Button type="submit" className="w-full" onClick={(e) => e.stopPropagation()}>
                    <Link className="h-4 w-4 mr-2" />
                    Create Download Link
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
