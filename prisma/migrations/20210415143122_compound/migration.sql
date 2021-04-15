/*
  Warnings:

  - The primary key for the `UsersReadingLog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UsersReadingLog" DROP CONSTRAINT "UsersReadingLog_pkey",
ADD PRIMARY KEY ("userId", "bookId", "status");
