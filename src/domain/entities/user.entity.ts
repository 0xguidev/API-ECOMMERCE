import { v4 as uuidv4 } from 'uuid';

import { Role as PrismaRole } from '../../../generated/prisma';

export enum Role {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  CUSTOMER = 'CUSTOMER',
}

export const mapPrismaRoleToDomain = (prismaRole: PrismaRole): Role => {
  switch (prismaRole) {
    case PrismaRole.ADMIN:
      return Role.ADMIN;
    case PrismaRole.SELLER:
      return Role.SELLER;
    case PrismaRole.CUSTOMER:
      return Role.CUSTOMER;
    default:
      return Role.CUSTOMER;
  }
};

export const mapDomainRoleToPrisma = (domainRole: Role): PrismaRole => {
  switch (domainRole) {
    case Role.ADMIN:
      return PrismaRole.ADMIN;
    case Role.SELLER:
      return PrismaRole.SELLER;
    case Role.CUSTOMER:
      return PrismaRole.CUSTOMER;
    default:
      return PrismaRole.CUSTOMER;
  }
};

export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public password?: string;
  public role: Role;
  public isTwoFactorEnabled: boolean;
  public twoFactorSecret?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuidv4();
    } else {
      this.id = id;
    }

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
