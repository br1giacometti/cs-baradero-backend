import Jornada from '../../domain/models/Jornada';

import BaseRepository from 'Base/repository/BaseRepository';

export default abstract class JornadaRepository extends BaseRepository<
  Jornada,
  number
> {
  abstract findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
  ): Promise<[Jornada[], number]>;
}
