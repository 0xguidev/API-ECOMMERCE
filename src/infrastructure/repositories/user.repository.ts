import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { User, mapPrismaRoleToDomain } from '../../domain/entities/user.entity';
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
        password: user.password,
        role: user.role as any,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        twoFactorSecret: user.twoFactorSecret,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return new User(
      {
        name: createdUser.name,
        email: createdUser.email,
        password: createdUser.password,
        role: mapPrismaRoleToDomain(createdUser.role),
        isTwoFactorEnabled: createdUser.isTwoFactorEnabled,
        twoFactorSecret: createdUser.twoFactorSecret,
      },
      createdUser.id,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user
      ? new User(
          {
            name: user.name,
            email: user.email,
            password: user.password,
            role: mapPrismaRoleToDomain(user.role),
            isTwoFactorEnabled: user.isTwoFactorEnabled,
            twoFactorSecret: user.twoFactorSecret,
          },
          user.id,
        )
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user
      ? new User(
          {
            name: user.name,
            email: user.email,
            password: user.password,
            role: mapPrismaRoleToDomain(user.role),
            isTwoFactorEnabled: user.isTwoFactorEnabled,
            twoFactorSecret: user.twoFactorSecret,
          },
          user.id,
        )
      : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(
      (user) =>
        new User(
          {
            name: user.name,
            email: user.email,
            password: user.password,
            role: mapPrismaRoleToDomain(user.role),
            isTwoFactorEnabled: user.isTwoFactorEnabled,
            twoFactorSecret: user.twoFactorSecret,
          },
          user.id,
        ),
    );
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const data: any = { ...userData, updatedAt: new Date() };
      if (userData.role) {
        data.role = userData.role as any;
      }
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });
      return new User(
        {
          name: updatedUser.name,
          email: updatedUser.email,
          password: updatedUser.password,
          role: mapPrismaRoleToDomain(updatedUser.role),
          isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
          twoFactorSecret: updatedUser.twoFactorSecret,
        },
        updatedUser.id,
      );
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
