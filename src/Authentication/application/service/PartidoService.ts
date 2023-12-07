import { Injectable } from '@nestjs/common';

import Partido from '../../domain/models/Partido';

import PartidoRepository from '../repository/PartidoRepository';
import UserDoesntExistsException from '../exception/UserDoesntExistsException';
import CreatePartidoDto from '../dto/CreatePartidoDto';
import PaginationMetaDto from 'Base/dto/PaginationMetaDto';

@Injectable()
export default class PartidoService {
  constructor(private readonly repository: PartidoRepository) {}

  async createPartido(userDto: CreatePartidoDto): Promise<Partido> {
    const user = new Partido(
      userDto.partido,
      userDto.mapa,
      userDto.equipoCT,
      userDto.equipoTT,
      userDto.rondasCT,
      userDto.rondasTT,
    );

    const userCreated = await this.repository.insert(user);

    return userCreated;
  }

  async editPartido(
    PartidoId: number,
    createPartidoDto: CreatePartidoDto,
  ): Promise<Partido> {
    return await this.repository.update(PartidoId, createPartidoDto);
  }

  async deleteUser(userId: number): Promise<Partido> {
    return await this.repository.delete(userId);
  }

  async findUserById(userId: number): Promise<Partido> {
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
  ): Promise<[Partido[], PaginationMetaDto]> {
    const [Partidos, totalItems] = await this.repository.findAndCountWithQuery(
      (page - 1) * limit,
      limit,
      query,
    );

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = Partidos.length;

    const paginationMeta: PaginationMetaDto = {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return [Partidos, paginationMeta];
  }

  async fetchAllUsers(): Promise<Partido[]> {
    const users = await this.repository.findAll();

    return users;
  }
}
