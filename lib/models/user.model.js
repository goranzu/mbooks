import argon from "argon2";
import prisma from "../prisma";

async function findUserByUsername(username) {
  return prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      books: { include: { book: true } },
    },
  });
}

async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      books: { include: { book: true } },
    },
  });
}

async function createUser({ username, password }) {
  const hashedPassword = await argon.hash(password);
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
    },
  });
}

export { findUserByUsername, findUserById, createUser };
