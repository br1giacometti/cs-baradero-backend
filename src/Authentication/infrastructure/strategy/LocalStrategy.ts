import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import * as bcrypt from 'bcrypt';

import User from 'Authentication/domain/models/User';

import UserService from 'Authentication/application/service/UserService';
import WrongPasswordException from 'Authentication/application/exception/WrongPasswordException';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findUserByEmail(email);

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        const pwExc = new WrongPasswordException();
        throw new WrongPasswordException(pwExc.message);
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
