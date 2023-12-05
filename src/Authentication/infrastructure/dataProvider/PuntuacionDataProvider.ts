import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import PuntuacionRepository from 'Authentication/application/repository/PuntuacionRepository';

import PuntuacionEntity from '../entity/PuntuacionEntity';
import Puntuacion from 'Authentication/domain/models/Puntuacion';

@Injectable()
export default class PuntuacionDataProvider implements PuntuacionRepository {
  client: Prisma.PuntuacionDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(prisma: PrismaClient) {
    this.client = prisma.puntuacion;
  }

  async insert(puntuacion: Puntuacion): Promise<Puntuacion> {
    const jugadorId = Number(puntuacion.jugador.id);
    const partidoId = Number(puntuacion.partido.id);
    try {
      const PuntuacionEntity = await this.client.create({
        data: {
          puntosObtenidos: puntuacion.puntosObtenidos,
          jugador: {
            connect: {
              id: jugadorId, // Reemplaza con el ID correcto del jugador
            },
          },
          partido: {
            connect: {
              id: partidoId, // Reemplaza con el ID correcto del partido
            },
          },
        },
      });

      return PuntuacionDataProvider.mapEntityToDomain(PuntuacionEntity);
    } catch (error) {
      console.error('Error al insertar la jornada:', error);
      // Puedes manejar el error aquí, lanzar una excepción diferente o devolver un valor predeterminado
      throw new Error('No se pudo insertar la jornada.');
    }
  }

  async findById(id: number): Promise<Puntuacion | null> {
    const PuntuacionEntity = await this.client.findUnique({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
    });

    return PuntuacionEntity
      ? PuntuacionDataProvider.mapEntityToDomain(PuntuacionEntity)
      : null;
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
  ): Promise<[Puntuacion[], number]> {
    query = query == undefined ? '' : query;
    const Puntuacions = await this.client.findMany({
      skip: skip,
      take: take,
    });

    const count = await this.client.count();

    return [
      Puntuacions.map((PuntuacionEntity) =>
        PuntuacionDataProvider.mapEntityToDomain(PuntuacionEntity),
      ),
      count,
    ];
  }

  async findAll(): Promise<Puntuacion[]> {
    const users = await this.client.findMany();

    return users.map((PuntuacionEntity) =>
      PuntuacionDataProvider.mapEntityToDomain(PuntuacionEntity),
    );
  }

  async update(
    id: number,
    partialUser: Partial<Puntuacion>,
  ): Promise<Puntuacion> {
    const PuntuacionEntity = await this.client.update({
      data: {
        puntosObtenidos: partialUser.puntosObtenidos,
      },
      where: {
        id,
      },
    });

    return PuntuacionDataProvider.mapEntityToDomain(PuntuacionEntity);
  }

  async delete(id: number): Promise<Puntuacion> {
    const PuntuacionEntity = await this.client.delete({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
    });

    return PuntuacionDataProvider.mapEntityToDomain(PuntuacionEntity);
  }

  public static mapEntityToDomain(
    PuntuacionEntity: PuntuacionEntity,
  ): Puntuacion {
    return new Puntuacion(undefined, undefined, undefined, PuntuacionEntity.id);
  }
}
