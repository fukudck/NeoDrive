import { PrismaClient } from "@prisma/client";
import DownloadClient from "./DownloadClient";
import { notFound } from "next/navigation";

export default async function DownloadPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { password?: string };
}) {
  const token = params.token;
  const password = searchParams.password || "";

  if (!token) return notFound();

  const prisma = new PrismaClient();
  const shareLink = await prisma.shareLink.findUnique({
    where: { token },
    include: { files: true },
  });

  if (!shareLink) return notFound();

  return <DownloadClient shareLink={shareLink} passwordFromURL={password} />;
}
