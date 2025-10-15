import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return new User(createdUser, createdUser.id);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? new User(user, user.id) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? new User(user, user.id) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new User(user, user.id));
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...userData,
          updatedAt: new Date(),
        },
      });
      return new User(updatedUser, updatedUser.id);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
