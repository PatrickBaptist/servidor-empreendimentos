import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { CreateUserInput } from "../validations/user";

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Este e-mail já está cadastrado");
    this.name = "EmailAlreadyExistsError";
  }
}

export const userService = {
  async create(data: CreateUserInput) {
    try {
      return await prisma.user.create({
        data,
        select: { id: true, name: true, email: true, createdAt: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new EmailAlreadyExistsError();
      }
      throw error;
    }
  },

  async findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  },
};