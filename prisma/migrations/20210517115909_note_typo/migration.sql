/*
  Warnings:

  - You are about to drop the column `notes` on the `UsersReadingLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersReadingLog" DROP COLUMN "notes",
ADD COLUMN     "note" TEXT NOT NULL DEFAULT E'No notes yet';
