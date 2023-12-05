import Puntuacion from '../../domain/models/Puntuacion';

import BaseRepository from 'Base/repository/BaseRepository';

export default abstract class PuntuacionRepository extends BaseRepository<
  Puntuacion,
  number
> {
  abstract findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
  ): Promise<[Puntuacion[], number]>;
}
