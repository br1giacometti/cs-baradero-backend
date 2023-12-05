import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import JornadaRepository from 'Authentication/application/repository/JornadaRepository';
import Jornada from 'Authentication/domain/models/Jornada';
import JornadaEntity from '../entity/JornadaEntity';
import PrismaClient from 'Base/config/prisma/PrismaClient';
import PartidoEntity from '../entity/PartidoEntity';
import Partido from 'Authentication/domain/models/Partido';
import PlayerEntity from '../entity/PlayerEntity';
import Player from 'Authentication/domain/models/Player';

@Injectable()
export default class JornadaDataProvider implements JornadaRepository {
  client: Prisma.JornadaDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(prisma: PrismaClient) {
    this.client = prisma.jornada;
  }

  async insert(jornada: Jornada): Promise<Jornada> {
    try {
      const partidos = jornada.partidos.map((partido) =>
        this.mapPartidosDomainToPartidosCreateEntity(partido),
      );

      const JornadaEntity = await this.client.create({
        data: {
          fecha: new Date(),
          partidos: {
            create: partidos,
          },
        },
        include: {
          partidos: { include: { equipoCT: true, equipoTT: true } },
        },
      });

      return JornadaDataProvider.mapEntityToDomain(JornadaEntity);
    } catch (error) {
      console.error('Error al insertar la jornada:', error);
      // Puedes manejar el error aquí, lanzar una excepción diferente o devolver un valor predeterminado
      throw new Error('No se pudo insertar la jornada.');
    }
  }

  async findById(id: number): Promise<Jornada | null> {
    const jornadaEntity = await this.client.findUnique({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
      include: {
        partidos: { include: { equipoCT: true, equipoTT: true } },
      },
    });

    return jornadaEntity
      ? JornadaDataProvider.mapEntityToDomain(jornadaEntity)
      : null;
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
  ): Promise<[Jornada[], number]> {
    query = query == undefined ? '' : query;
    const Jornadas = await this.client.findMany({
      skip: skip,
      take: take,
      include: {
        partidos: { include: { equipoCT: true, equipoTT: true } },
      },
    });

    const count = await this.client.count();

    return [
      Jornadas.map((jornadaEntity) =>
        JornadaDataProvider.mapEntityToDomain(jornadaEntity),
      ),
      count,
    ];
  }

  async findAll(): Promise<Jornada[]> {
    const users = await this.client.findMany({
      include: {
        partidos: { include: { equipoCT: true, equipoTT: true } },
      },
    });

    return users.map((jornadaEntity) =>
      JornadaDataProvider.mapEntityToDomain(jornadaEntity),
    );
  }

  async delete(id: number): Promise<Jornada> {
    const jornadaEntity = await this.client.delete({
      where: {
        id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
      include: {
        partidos: { include: { equipoCT: true, equipoTT: true } },
      },
    });

    return JornadaDataProvider.mapEntityToDomain(jornadaEntity);
  }

  async update(id: number, partialUser: Partial<Jornada>): Promise<Jornada> {
    const jornadaEntity = await this.client.update({
      data: {
        fecha: partialUser.fecha,
      },
      where: {
        id,
      },
      include: {
        partidos: { include: { equipoCT: true, equipoTT: true } },
      },
    });

    return JornadaDataProvider.mapEntityToDomain(jornadaEntity);
  }

  // Esta función calcula la puntuación para un jugador según su posición
  public static calcularPuntuacion = (posicion: number): number => {
    const puntuaciones = [10, 8, 6, 4, 2, 1, 0];
    return puntuaciones[Math.min(posicion, puntuaciones.length - 1)];
  };

  public static mapEntityToDomain(
    jornadaEntity: JornadaEntity & {
      partidos: (PartidoEntity & {
        equipoCT?: PlayerEntity[];
        equipoTT?: PlayerEntity[];
      })[];
    },
  ): Jornada {
    const partidos = Array.isArray(jornadaEntity.partidos)
      ? jornadaEntity.partidos.map((partidoEntity) => {
          // Calcula las puntuaciones para los jugadores de cada equipo
          const puntuacionesCT = partidoEntity.equipoCT.map(
            (player, index) => ({
              ...player,
              puntuacion: JornadaDataProvider.calcularPuntuacion(index),
            }),
          );
          const puntuacionesTT = partidoEntity.equipoTT.map(
            (player, index) => ({
              ...player,
              puntuacion: JornadaDataProvider.calcularPuntuacion(index),
            }),
          );

          return {
            numero: partidoEntity.numero,
            mapa: partidoEntity.mapa,
            equipoCT: puntuacionesCT,
            equipoTT: puntuacionesTT,
          };
        })
      : [];

    return new Jornada(partidos, jornadaEntity.fecha, jornadaEntity.id);
  }

  private mapPartidosDomainToPartidosCreateEntity(
    partido: Partido,
  ): Prisma.PartidoCreateWithoutJornadaInput {
    const puntuaciones = partido.equipoCT.map((player, index) =>
      this.mapQuotasDomainToQuotasCreateEntity(player, index),
    );

    puntuaciones.push(
      ...partido.equipoTT.map((player, index) =>
        this.mapQuotasDomainToQuotasCreateEntity(player, index),
      ),
    );

    return {
      numero: partido.numero,
      mapa: partido.mapa,
      equipoCT: {
        connect: partido.equipoCT.map((player) => ({ id: player.id })),
      },
      equipoTT: {
        connect: partido.equipoTT.map((player) => ({ id: player.id })),
      },
      puntuaciones: {
        create: puntuaciones,
      },
    };
  }

  private mapQuotasDomainToQuotasCreateEntity(
    jugador: Player,
    index: number,
  ): Prisma.PuntuacionCreateWithoutPartidoInput {
    return {
      puntosObtenidos: JornadaDataProvider.calcularPuntuacion(index),
      jugador: { connect: { id: jugador.id } },
    };
  }
}
