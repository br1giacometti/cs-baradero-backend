import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import User from 'Authentication/domain/models/User';
import Role from 'Authentication/domain/models/Role';

import InvalidPasswordException from '../exception/InvalidPasswordException';

import UserService from './UserService';
import SignUpDto from '../dto/Authentication/SignUpDto';
import LoginResponseDto from '../dto/Authentication/LoginResponseDto';

@Injectable()
export default class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUpAdmin(signUpDto: SignUpDto): Promise<User> {
    const isPasswordValid = AuthenticationService.validatePassword(
      signUpDto.password,
    );

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    const passwordHashed = await bcrypt.hash(signUpDto.password, 10);

    const userCreated = await this.userService.createUser({
      email: signUpDto.email,
      name: signUpDto.name,
      role: Role.ADMIN,
      passwordHashed,
    });

    return userCreated;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const isPasswordValid = AuthenticationService.validatePassword(
      signUpDto.password,
    );

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    const passwordHashed = await bcrypt.hash(signUpDto.password, 10);

    const userCreated = await this.userService.createUser({
      email: signUpDto.email,
      name: signUpDto.name,
      role: Role.USER,
      passwordHashed,
    });

    return userCreated;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload = { email: user.email, id: user.id };

    const accessToken = this.jwtService.sign(payload);

    return { user, accessToken };
  }

  private static validatePassword(password: string) {
    // Is at least 6 characters long, contains at least one leter and contains at least one number
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  }

  async deleteAccount(userId: number): Promise<User> {
    return await this.userService.deleteUser(userId);
  }
}
