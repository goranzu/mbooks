/*
  Warnings:

  - You are about to drop the column `averageRating` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `publicationYear` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `goodreadsId` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googelId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googelId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicationDate` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book.goodreadsId_unique";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "averageRating",
DROP COLUMN "publicationYear",
DROP COLUMN "goodreadsId",
ADD COLUMN     "googelId" TEXT NOT NULL,
ADD COLUMN     "publicationDate" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book.googelId_unique" ON "Book"("googelId");
