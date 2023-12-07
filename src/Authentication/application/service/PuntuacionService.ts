import { Injectable } from '@nestjs/common';

import Puntuacion from '../../domain/models/Puntuacion';

import PuntuacionRepository from '../repository/PuntuacionRepository';
import UserDoesntExistsException from '../exception/UserDoesntExistsException';
import CreatePuntuacionDto from '../dto/CreatePuntuacionDto';
import PaginationMetaDto from 'Base/dto/PaginationMetaDto';

@Injectable()
export default class PuntuacionService {
  constructor(private readonly repository: PuntuacionRepository) {}

  async createPuntuacion(userDto: CreatePuntuacionDto): Promise<Puntuacion> {
    console.log('partidoID', userDto.partidoId);
    const puntuacion = new Puntuacion(
      userDto.puntosObtenidos,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      userDto.player,
      userDto.partido,
      userDto.partidoId,
    );

    const puntuacionEntity = await this.repository.insert(puntuacion);

    return puntuacionEntity;
  }

  async editPuntuacion(
    PuntuacionId: number,
    createPuntuacionDto: CreatePuntuacionDto,
  ): Promise<Puntuacion> {
    return await this.repository.update(PuntuacionId, createPuntuacionDto);
  }

  async deleteUser(userId: number): Promise<Puntuacion> {
    return await this.repository.delete(userId);
  }

  async findUserById(userId: number): Promise<Puntuacion> {
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
  ): Promise<[Puntuacion[], PaginationMetaDto]> {
    const [Puntuacions, totalItems] =
      await this.repository.findAndCountWithQuery(
        (page - 1) * limit,
        limit,
        query,
      );

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = Puntuacions.length;

    const paginationMeta: PaginationMetaDto = {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return [Puntuacions, paginationMeta];
  }

  async fetchAllUsers(): Promise<Puntuacion[]> {
    const users = await this.repository.findAll();

    return users;
  }
}
