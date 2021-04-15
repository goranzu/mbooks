import { PrismaClient } from "@prisma/client";

let prisma;

const prismaOptions = {
  log: ["query", "info", "warn", "error"],
};

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(prismaOptions);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaOptions);
  }

  prisma = global.prisma;
}

export default prisma;
