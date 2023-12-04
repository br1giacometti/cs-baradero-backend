import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import Player from 'Authentication/domain/models/Player';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import Jornada from 'Authentication/domain/models/Jornada';
import JornadaService from 'Authentication/application/service/JornadaService';
import CreateJornadaDto from 'Authentication/application/dto/CreateJornadaDto';

@Controller('jornadas')
export default class JornadaController {
  constructor(private jornadaService: JornadaService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllUsers(): Promise<Jornada[]> {
    return this.jornadaService.fetchAllUsers().then((users) => users);
  }

  @Get('/pagination')
  async getAllPersonsPagination(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('query') query: string,
  ): Promise<{ data: Jornada[]; meta: PaginationMetaDto }> {
    const [parcels, paginationMeta] =
      await this.jornadaService.getAllPaginationWithQuery(+page, +limit, query);

    return { data: parcels, meta: paginationMeta };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async getUserById(@Param('id') userId: number): Promise<Jornada> {
    return this.jornadaService
      .findUserById(userId)
      .then((user) => user)
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

  @Post('/create')
  async createJornada(
    @Body() createJornadaDto: CreateJornadaDto,
  ): Promise<Jornada> {
    return this.jornadaService
      .createJornada(createJornadaDto)
      .then((person) => person)
      .catch((error) => {
        switch (error.name) {
          case 'InvalidEmailException': {
            throw new HttpException(error.message, 400);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  async deleteUser(@Param('id') userId: number): Promise<boolean> {
    return this.jornadaService
      .deleteUser(userId)
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
}
