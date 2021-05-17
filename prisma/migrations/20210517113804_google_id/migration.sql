-- DropForeignKey
ALTER TABLE "UsersReadingLog" DROP CONSTRAINT "UsersReadingLog_bookId_fkey";

-- AddForeignKey
ALTER TABLE "UsersReadingLog" ADD FOREIGN KEY ("bookId") REFERENCES "Book"("googleId") ON DELETE CASCADE ON UPDATE CASCADE;
