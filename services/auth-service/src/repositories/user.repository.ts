// src/repositories/user.repository.ts
import { prisma } from "../db/prismaClient";
import type { User } from "@prisma/client";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
  roles?: string[];
  isPro?: boolean;
}): Promise<User> => {
  return prisma.user.create({
    data: { 
      email: data.email,
      password: data.password,
      name: data.name,
      roles: data.roles ?? ["msmeOwner"],
      isPro: data.isPro ?? false,
    }
  });
};
