import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import Role from 'Authentication/domain/models/Role';
import User from 'Authentication/domain/models/User';
import UserRepository from 'Authentication/application/repository/UserRepository';

import UserEntity from '../entity/UserEntity';
import RoleEntity from '../entity/RoleEntity';

@Injectable()
export default class UserDataProvider implements UserRepository {
  client: Prisma.UserDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(prisma: PrismaClient) {
    this.client = prisma.user;
  }

  async insert(user: User): Promise<User> {
    try {
      const userEntity = await this.client.create({
        data: {
          name: user.name,
          email: user.email,
          role: Role[user.role],
          password: user.password,
        },
      });
      return UserDataProvider.mapEntityToDomain(userEntity);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Already exists user with this email');
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.client.findUnique({
      where: { id },
    });

    return UserDataProvider.mapEntityToDomain(userEntity);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const userEntity = await this.client.findUnique({
      where: { email },
    });
    return userEntity ? UserDataProvider.mapEntityToDomain(userEntity) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.client.findMany({});

    return users.map((userEntity) =>
      UserDataProvider.mapEntityToDomain(userEntity),
    );
  }

  async delete(id: number): Promise<User> {
    const userEntity = await this.client.delete({
      where: { id },
    });

    return UserDataProvider.mapEntityToDomain(userEntity);
  }

  async update(id: number, partialUser: Partial<User>): Promise<User> {
    const userEntity = await this.client.update({
      data: {
        name: partialUser.name,
        email: partialUser.email,
        role: this.mapDomainRoleToEntity(partialUser.role),
      },
      where: {
        id,
      },
    });

    return UserDataProvider.mapEntityToDomain(userEntity);
  }

  public static mapEntityToDomain(userEntity: UserEntity): User {
    return new User(
      userEntity.name ?? '',
      userEntity.email,
      Role[userEntity.role],
      userEntity.password,
      userEntity.id,
    );
  }

  private mapDomainRoleToEntity(role: Role): RoleEntity | undefined {
    return Role[role];
  }
}
