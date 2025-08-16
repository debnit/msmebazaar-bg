import { prisma } from "../db/prismaClient";
import { hashPassword, verifyPassword, createJwtToken } from "@shared/auth";
import { Config } from "../config/env";

export async function register({ email, password, name }) {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new Error("User already exists");

  const pwHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: pwHash, name, roles: ["msmeOwner"] }
  });
  return { id: user.id, email: user.email, name: user.name, roles: user.roles };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");
  const valid = await verifyPassword(password, user.password);
  if (!valid) throw new Error("Invalid email or password");
  const token = createJwtToken({
    id: user.id, roles: user.roles, isPro: user.isPro
  }, Config.jwtSecret, "1d");
  return { token, userId: user.id, isPro: user.isPro };
}
