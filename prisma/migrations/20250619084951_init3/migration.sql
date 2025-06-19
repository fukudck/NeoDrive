/*
  Warnings:

  - You are about to drop the column `fileId` on the `ShareLink` table. All the data in the column will be lost.
  - Added the required column `shareLinkId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `ShareLink` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShareLink" DROP CONSTRAINT "ShareLink_fileId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "shareLinkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShareLink" DROP COLUMN "fileId",
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_shareLinkId_fkey" FOREIGN KEY ("shareLinkId") REFERENCES "ShareLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
