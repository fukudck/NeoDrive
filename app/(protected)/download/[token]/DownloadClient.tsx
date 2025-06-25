'use client';

import React, { useEffect, useState } from "react";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { GoReport } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface File {
  id: string;
  filename: string;
  mime: string;
}

interface ShareLink {
  title: string | null;
  token: string;
  files: File[];
}

interface DownloadClientProps {
  shareLink: ShareLink;
  passwordFromURL: string;
}

export default function DownloadClient({ shareLink, passwordFromURL }: DownloadClientProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [password, setPassword] = useState(passwordFromURL || "");

  const handleDownload = async () => {
    const query = new URLSearchParams();
    if (password) query.set("password", password);

    const url = `/api/download/${shareLink.token}?${query.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Tải thất bại");
      <Alert variant="destructive">
        <AlertTitle>Download Fails</AlertTitle>
        <AlertDescription>
          Wrong password or token error!
        </AlertDescription>
      </Alert>
      return;
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || "files.zip";

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(downloadUrl);

    setIsDownloaded(true);
  };

  return (
    <section className="bg-white dark:bg-[#0C0A09] flex items-center justify-center">
      <div className="container pt-5">
        <div className="bg-white dark:bg-[#303030] shadow-xl border-t-2 border-l-2 h-auto w-[350px] mx-auto rounded-xl flex flex-col">
          <div className="px-6 py-7 overflow-y-auto flex-1">
            <div className="rounded-full bg-gray-100 dark:bg-white/100 w-[160px] h-[160px] mx-auto flex items-center justify-center mb-6">
              {isDownloaded ? (
                <FaCheckCircle className="text-[45px] text-black" />
              ) : (
                <MdOutlineDownloadForOffline className="text-[45px] text-gray-600" />
              )}
            </div>

            <div className="text-center mb-6">
              <div className="text-[22px] font-semibold mb-2 dark:text-white">
                {isDownloaded ? "Your download has started" : "Your files are ready"}
              </div>
              <p className="text-[15px] text-gray-500">
                {isDownloaded
                  ? "Files are being downloaded to your device"
                  : "Transfer expires in about 24 hours"}
              </p>
            </div>

            {/* File List */}
            <div className="space-y-3 mb-4">
              {shareLink.files.map((item) => (
                <div key={item.id} className="flex justify-between items-center w-full bg-gray-50 px-4 py-3 rounded-lg border">
                  <div className="flex flex-col">
                    <p className="text-[16px] font-medium text-gray-800">{item.filename}</p>
                    <p className="text-[13px] text-gray-500">{item.mime}</p>
                  </div>
                  <div className="flex items-center">
                    {isDownloaded ? (
                      <FaCheckCircle className="text-[20px] text-black" />
                    ) : (
                      <MdOutlineDownloadForOffline className="text-[24px] text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Password Input */}
            <input
              type="password"
              placeholder="Enter password if required"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border focus:outline-none rounded"
            />

            {/* Report */}
            <div className="w-full flex items-center justify-center gap-2 text-[14px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <GoReport className="text-[18px]" />
              <span>Report this transfer</span>
            </div>
          </div>

          <div className="w-full p-6 border-t bg-white dark:bg-[#303030] rounded-b-xl">
            <Button
              variant="default"
              className="w-full h-12 text-[16px] font-medium rounded-lg transition-colors"
              onClick={handleDownload}
            >
              {isDownloaded ? <FaCheckCircle className="w-full" /> : "Download"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
