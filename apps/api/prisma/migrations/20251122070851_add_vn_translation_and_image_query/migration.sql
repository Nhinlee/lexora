/*
  Warnings:

  - You are about to drop the column `imageSearchQuery` on the `Vocabulary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "imageSearchQuery",
ADD COLUMN     "imageQuery" TEXT,
ADD COLUMN     "vnTranslation" TEXT;
