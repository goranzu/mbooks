/*
  Warnings:

  - You are about to drop the column `googelId` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googleId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book.googelId_unique";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "googelId",
ADD COLUMN     "googleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book.googleId_unique" ON "Book"("googleId");
