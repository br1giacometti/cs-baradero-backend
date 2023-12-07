import { Injectable } from '@nestjs/common';

import User from '../../domain/models/User';

import UserRepository from '../repository/UserRepository';
import CreateUserDto from '../dto/User/CreateUserDto';
import UserDoesntExistsException from '../exception/UserDoesntExistsException';

@Injectable()
export default class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = new User(
      userDto.name,
      userDto.email,
      userDto.role,
      userDto.passwordHashed,
    );

    const userCreated = await this.repository.insert(user);

    return userCreated;
  }

  async deleteUser(userId: number): Promise<User> {
    return await this.repository.delete(userId);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.repository.findUserByEmail(email);

    if (user === null) {
      throw new UserDoesntExistsException();
    }

    return user;
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.repository.findById(userId);

    if (user === null) {
      throw new UserDoesntExistsException();
    }

    return user;
  }

  async fetchAllUsers(): Promise<User[]> {
    const users = await this.repository.findAll();

    return users;
  }
}
