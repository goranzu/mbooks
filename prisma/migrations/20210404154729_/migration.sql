/*
  Warnings:

  - A unique constraint covering the columns `[goodreadsId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Book.goodreadsId_unique" ON "Book"("goodreadsId");
