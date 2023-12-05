import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import PartidoRepository from 'Authentication/application/repository/PartidoRepository';

import PartidoEntity from '../entity/PartidoEntity';
import Partido from 'Authentication/domain/models/Partido';

@Injectable()
export default class PartidoDataProvider implements PartidoRepository {
  client: Prisma.PartidoDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(prisma: PrismaClient) {
    this.client = prisma.partido;
  }

  async insert(partido: Partido): Promise<Partido> {
    const jornadaId = Number(partido.jornadaId);
    const partidoEntity = await this.client.create({
      data: {
        numero: partido.numero,
        mapa: partido.mapa,
        equipoCT: {
          connect: partido.equipoCT.map((player) => ({ id: player.id })),
        },
        equipoTT: {
          connect: partido.equipoTT.map((player) => ({ id: player.id })),
        },
        Jornada: { connect: { id: jornadaId } },
      },
      include: { Jornada: true },
    });

    return PartidoDataProvider.mapEntityToDomain(partidoEntity);
  }

  async findById(id: number): Promise<Partido | null> {
    const PartidoEntity = await this.client.findUnique({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
    });

    return PartidoEntity
      ? PartidoDataProvider.mapEntityToDomain(PartidoEntity)
      : null;
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
  ): Promise<[Partido[], number]> {
    query = query == undefined ? '' : query;
    const Partidos = await this.client.findMany({
      skip: skip,
      take: take,
    });

    const count = await this.client.count();

    return [
      Partidos.map((PartidoEntity) =>
        PartidoDataProvider.mapEntityToDomain(PartidoEntity),
      ),
      count,
    ];
  }

  async findAll(): Promise<Partido[]> {
    const users = await this.client.findMany();

    return users.map((PartidoEntity) =>
      PartidoDataProvider.mapEntityToDomain(PartidoEntity),
    );
  }

  async delete(id: number): Promise<Partido> {
    const PartidoEntity = await this.client.delete({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
    });

    return PartidoDataProvider.mapEntityToDomain(PartidoEntity);
  }

  async update(id: number, partialUser: Partial<Partido>): Promise<Partido> {
    const PartidoEntity = await this.client.update({
      data: {
        numero: partialUser.numero,
        mapa: partialUser.mapa,
      },
      where: {
        id,
      },
    });

    return PartidoDataProvider.mapEntityToDomain(PartidoEntity);
  }

  public static mapEntityToDomain(partidoEntity: PartidoEntity): Partido {
    return new Partido(
      partidoEntity.numero,
      partidoEntity.mapa,
      undefined,
      undefined,
      undefined,
      partidoEntity.id,
    );
  }
}
