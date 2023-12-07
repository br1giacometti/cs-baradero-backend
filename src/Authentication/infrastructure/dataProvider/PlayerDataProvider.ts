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
    try {
      const PlayerEntity = await this.client.create({
        data: {
          tag: user.tag,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });

      return PlayerDataProvider.mapEntityToDomain(PlayerEntity);
    } catch (error) {
      console.error('Error al insertar la jornada:', error);
      // Puedes manejar el error aquí, lanzar una excepción diferente o devolver un valor predeterminado
      throw new Error('No se pudo insertar la jornada.');
    }
  }

  async findById(id: number): Promise<Player | null> {
    const PlayerEntity = await this.client.findUnique({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
      include: { puntuaciones: true },
    });

    return PlayerEntity
      ? PlayerDataProvider.mapEntityToDomain(PlayerEntity)
      : null;
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
      include: { puntuaciones: true },
    });

    const count = await this.client.count();

    // Ordenar los jugadores por totalPuntos / totalPartidos en orden descendente
    const sortedPlayers = players
      .map((PlayerEntity) => PlayerDataProvider.mapEntityToDomain(PlayerEntity))
      .sort((a, b) => {
        const ratioA = a.totalPuntos / (a.totalGanados + a.totalPerdidos);
        const ratioB = b.totalPuntos / (b.totalGanados + b.totalPerdidos);
        return ratioB - ratioA;
      });

    return [sortedPlayers, count];
  }

  async findAll(): Promise<Player[]> {
    const users = await this.client.findMany({
      include: {
        puntuaciones: true,
      },
    });

    return users.map((PlayerEntity) =>
      PlayerDataProvider.mapEntityToDomain(PlayerEntity),
    );
  }

  async delete(id: number): Promise<Player> {
    const PlayerEntity = await this.client.delete({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
    });

    return PlayerDataProvider.mapEntityToDomain(PlayerEntity);
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

    return PlayerDataProvider.mapEntityToDomain(PlayerEntity);
  }

  public static mapEntityToDomain(playerEntity: PlayerEntity): Player {
    const puntuaciones = playerEntity.puntuaciones
      ? playerEntity.puntuaciones.map((puntuacionEntity) => {
          return new Puntuacion(
            puntuacionEntity.puntosObtenidos,
            puntuacionEntity.partidosGanados,
            puntuacionEntity.partidosPerdidos,
            puntuacionEntity.jornadasGanadas,
            puntuacionEntity.jornadasPerdidas,
            puntuacionEntity.jornadasEmpatados,
          );
        })
      : [];

    const cantidadPartidosJugados = puntuaciones.length;

    let totalPuntos = 0;
    let totalPartidosGanados = 0;
    let totalPartidosPerdidos = 0;
    let totalJornadasGanadas = 0;
    let totalJornadasEmpatados = 0;
    let totalJornadasPerdidas = 0;

    puntuaciones.forEach((puntuacion) => {
      totalPuntos += puntuacion.puntosObtenidos;
      totalPartidosGanados += puntuacion.partidosGanados;
      totalPartidosPerdidos += puntuacion.partidosPerdidos;
      totalJornadasGanadas += puntuacion.jornadasGanadas;
      totalJornadasEmpatados += puntuacion.jornadasEmpatados;
      totalJornadasPerdidas += puntuacion.jornadasPerdidas;
    });

    return new Player(
      playerEntity.tag,
      playerEntity.firstName,
      playerEntity.lastName,
      undefined,
      totalPuntos,
      cantidadPartidosJugados,
      totalPartidosGanados,
      totalPartidosPerdidos,
      totalJornadasGanadas,
      totalJornadasPerdidas,
      totalJornadasEmpatados,
      playerEntity.id,
    );
  }
}
