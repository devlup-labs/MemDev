/*
  Warnings:

  - You are about to drop the column `generatedAt` on the `Memories` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Memories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Memories" DROP COLUMN "generatedAt",
ADD COLUMN     "embeddingGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tsVectorTagsGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
