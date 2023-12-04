import { Injectable } from '@nestjs/common';

import Jornada from '../../domain/models/Jornada';

import JornadaRepository from '../repository/JornadaRepository';
import UserDoesntExistsException from '../exception/UserDoesntExistsException';
import CreateJornadaDto from '../dto/CreateJornadaDto';
import PaginationMetaDto from 'Base/dto/PaginationMetaDto';

@Injectable()
export default class JornadaService {
  constructor(private readonly repository: JornadaRepository) {}

  async createJornada(userDto: CreateJornadaDto): Promise<Jornada> {
    const user = new Jornada(userDto.partidos);

    const userCreated = await this.repository.insert(user);

    return userCreated;
  }

  async editJornada(
    JornadaId: number,
    createJornadaDto: CreateJornadaDto,
  ): Promise<Jornada> {
    return await this.repository.update(JornadaId, createJornadaDto);
  }

  async deleteUser(userId: number): Promise<Jornada> {
    return await this.repository.delete(userId);
  }

  async findUserById(userId: number): Promise<Jornada> {
    const user = await this.repository.findById(userId);

    if (user === null) {
      throw new UserDoesntExistsException();
    }

    return user;
  }

  async getAllPaginationWithQuery(
    page: number,
    limit: number,
    query: string,
  ): Promise<[Jornada[], PaginationMetaDto]> {
    const [Jornadas, totalItems] = await this.repository.findAndCountWithQuery(
      (page - 1) * limit,
      limit,
      query,
    );

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = Jornadas.length;

    const paginationMeta: PaginationMetaDto = {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return [Jornadas, paginationMeta];
  }

  async fetchAllUsers(): Promise<Jornada[]> {
    const users = await this.repository.findAll();

    return users;
  }
}
