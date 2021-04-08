-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('PLAN_TO_READ', 'FINISHED_READING');

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "averageRating" INTEGER NOT NULL,
    "publicationYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersReadingLog" (
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "status" "BookStatus" NOT NULL DEFAULT E'PLAN_TO_READ',

    PRIMARY KEY ("userId","bookId")
);

-- AddForeignKey
ALTER TABLE "UsersReadingLog" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersReadingLog" ADD FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
