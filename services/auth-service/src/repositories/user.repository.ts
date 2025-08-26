import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });
  }

  static async createUser(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  static async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
