import { Injectable } from '@nestjs/common';

import Player from '../../domain/models/Player';

import PlayerRepository from '../repository/PlayerRepository';
import UserDoesntExistsException from '../exception/UserDoesntExistsException';
import CreateUserDto from '../dto/CreatePlayerDto';
import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import CreatePlayerDto from '../dto/CreatePlayerDto';

@Injectable()
export default class PlayerService {
  constructor(private readonly repository: PlayerRepository) {}

  async createPlayer(userDto: CreateUserDto): Promise<Player> {
    const user = new Player(userDto.tag, userDto.firstName, userDto.lastName);

    const userCreated = await this.repository.insert(user);

    return userCreated;
  }

  async editPlayer(
    playerId: number,
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.repository.update(playerId, createPlayerDto);
  }

  async deleteUser(userId: number): Promise<Player> {
    return await this.repository.delete(userId);
  }

  async findUserById(userId: number): Promise<Player> {
    const user = await this.repository.findById(userId);

    if (user === null) {
      throw new UserDoesntExistsException();
    }

    return user;
  }

  async findUserByEmail(tag: string): Promise<Player> {
    const user = await this.repository.findUserByTag(tag);

    if (user === null) {
      throw new UserDoesntExistsException();
    }

    return user;
  }

  async getAllPaginationWithQuery(
    page: number,
    limit: number,
    query: string,
  ): Promise<[Player[], PaginationMetaDto]> {
    const [players, totalItems] = await this.repository.findAndCountWithQuery(
      (page - 1) * limit,
      limit,
      query,
    );

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = players.length;

    const paginationMeta: PaginationMetaDto = {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return [players, paginationMeta];
  }

  async fetchAllUsers(): Promise<Player[]> {
    const users = await this.repository.findAll();

    return users;
  }
}
