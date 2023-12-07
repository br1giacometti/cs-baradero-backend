import { Request } from 'express';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import User from 'Authentication/domain/models/User';

import AuthenticationService from 'Authentication/application/service/AuthenticationService';

import SignUpDto from 'Authentication/application/dto/Authentication/SignUpDto';
import LoginResponseDto from 'Authentication/application/dto/Authentication/LoginResponseDto';

import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';
import { LocalAuthGuard } from 'Authentication/infrastructure/guards/LocalAuthGuard';
import SignUpSchema from 'Authentication/application/schema/SignUpSchema';
import { ZodValidationPipe } from 'Base/pipe/ZodValidationPipe';

@Controller('auth')
export default class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/sign-up-admin')
  async signUpAdminUser(@Body() signUpUserDto: SignUpDto): Promise<User> {
    return this.authenticationService
      .signUpAdmin(signUpUserDto)
      .then((user) => user)
      .catch((error) => {
        switch (error.name) {
          case 'InvalidEmailException': {
            throw new HttpException(error.message, 404);
          }
          case 'InvalidPasswordException': {
            throw new HttpException(error.message, 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @UsePipes(new ZodValidationPipe(SignUpSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/sign-up')
  async signUpUser(@Body() singUpUserDto: SignUpDto): Promise<User> {
    return this.authenticationService
      .signUp(singUpUserDto)
      .then((user) => user)
      .catch((error) => {
        switch (error.name) {
          case 'InvalidEmailException': {
            throw new HttpException(error.message, 404);
          }
          case 'InvalidPasswordException': {
            throw new HttpException(error.message, 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(
    @Req() request: Request & { user: User },
  ): Promise<LoginResponseDto> {
    return this.authenticationService
      .login(request.user)
      .then((loginResponse) => loginResponse)
      .catch((error) => {
        switch (error.name) {
          case 'WrongPasswordException': {
            throw new HttpException(error.message, 404);
          }
          case 'UserDoesntExistsException': {
            throw new HttpException(error.message, 404);
          }
          default: {
            const errorMessage =
              typeof error.message === 'string' ? error.message : undefined;
            throw new UnauthorizedException(error, errorMessage);
          }
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  async deleteUser(@Param('id') userId: string): Promise<boolean> {
    return this.authenticationService
      .deleteAccount(parseInt(userId))
      .then((userDeleted) => !!userDeleted)
      .catch((error) => {
        switch (error.name) {
          case 'UserDoesntExistsException': {
            throw new HttpException(error.message, 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/validate-authorization')
  async validateAuthorization(
    @Req() request: Request & { user: User },
  ): Promise<User> {
    return request.user;
  }
}
