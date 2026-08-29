/*
  Warnings:

  - You are about to drop the column `accessCount` on the `Memories` table. All the data in the column will be lost.
  - You are about to drop the column `lastAccessedAt` on the `Memories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Memories" DROP COLUMN "accessCount",
DROP COLUMN "lastAccessedAt";
