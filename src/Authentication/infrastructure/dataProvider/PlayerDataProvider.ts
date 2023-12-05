import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import PlayerRepository from 'Authentication/application/repository/PlayerRepository';

import PlayerEntity from '../entity/PlayerEntity';
import Player from 'Authentication/domain/models/Player';
import Puntuacion from 'Authentication/domain/models/Puntuacion';

@Injectable()
export default class PlayerDataProvider implements PlayerRepository {
  client: Prisma.PlayerDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(prisma: PrismaClient) {
    this.client = prisma.player;
  }

  async insert(user: Player): Promise<Player> {
    const PlayerEntity = await this.client.create({
      data: {
        tag: user.tag,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    return this.mapEntityToDomain(PlayerEntity);
  }

  async findById(id: number): Promise<Player | null> {
    const PlayerEntity = await this.client.findUnique({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
      include: { puntuaciones: true },
    });

    return PlayerEntity ? this.mapEntityToDomain(PlayerEntity) : null;
  }

  //async findUserByTag(tag: string): Promise<Player | null> {
  //const PlayerEntity = await this.client.findUnique({
  //where: { tag },
  //});
  //return PlayerEntity ? this.mapEntityToDomain(PlayerEntity) : null;
  //}

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
  ): Promise<[Player[], number]> {
    query = query == undefined ? '' : query;
    const players = await this.client.findMany({
      skip: skip,
      take: take,
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { tag: { contains: query } },
        ],
      },
    });

    const count = await this.client.count();

    return [
      players.map((PlayerEntity) => this.mapEntityToDomain(PlayerEntity)),
      count,
    ];
  }

  async findAll(): Promise<Player[]> {
    const users = await this.client.findMany({
      include: {
        puntuaciones: true,
      },
    });

    return users.map((PlayerEntity) => this.mapEntityToDomain(PlayerEntity));
  }

  async delete(id: number): Promise<Player> {
    const PlayerEntity = await this.client.delete({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
    });

    return this.mapEntityToDomain(PlayerEntity);
  }

  async update(id: number, partialUser: Partial<Player>): Promise<Player> {
    const PlayerEntity = await this.client.update({
      data: {
        tag: partialUser.tag,
        firstName: partialUser.firstName,
        lastName: partialUser.lastName,
      },
      where: {
        id,
      },
    });

    return this.mapEntityToDomain(PlayerEntity);
  }

  private mapEntityToDomain(PlayerEntity: PlayerEntity): Player {
    const puntuaciones = PlayerEntity.puntuaciones
      ? PlayerEntity.puntuaciones.map((puntuacionEntity) => {
          return new Puntuacion(
            puntuacionEntity.puntosObtenidos,
            undefined,
            undefined,
          );
        })
      : [];

    return new Player(
      PlayerEntity.tag,
      PlayerEntity.firstName,
      PlayerEntity.lastName,
      puntuaciones,
      puntuaciones.reduce((total, puntuacion) => {
        return total + puntuacion.puntosObtenidos;
      }, 0),
      PlayerEntity.id,
    );
  }
}
