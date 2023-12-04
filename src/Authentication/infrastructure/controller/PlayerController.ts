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

import PlayerService from 'Authentication/application/service/PlayerService';
import CreatePlayerDto from 'Authentication/application/dto/CreatePlayerDto';
import PaginationMetaDto from 'Base/dto/PaginationMetaDto';

@Controller('players')
export default class PlayerController {
  constructor(private playerService: PlayerService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllUsers(): Promise<Player[]> {
    return this.playerService.fetchAllUsers().then((users) => users);
  }

  @Get('/pagination')
  async getAllPersonsPagination(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('query') query: string,
  ): Promise<{ data: Player[]; meta: PaginationMetaDto }> {
    const [parcels, paginationMeta] =
      await this.playerService.getAllPaginationWithQuery(+page, +limit, query);

    return { data: parcels, meta: paginationMeta };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async getUserById(@Param('id') userId: number): Promise<Player> {
    return this.playerService
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
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return this.playerService
      .createPlayer(createPlayerDto)
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
    return this.playerService
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

  @Patch('/:id')
  async editPlayer(
    @Param('id') personId: string,
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    try {
      const updatedPlayer = await this.playerService.editPlayer(
        +personId,
        createPlayerDto,
      );

      return updatedPlayer;
    } catch (error) {
      if (error.errors) {
        throw new HttpException(
          error.errors[0].message,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // Other error
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
