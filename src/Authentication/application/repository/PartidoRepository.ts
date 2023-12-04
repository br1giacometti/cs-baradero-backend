import Partido from '../../domain/models/Partido';

import BaseRepository from 'Base/repository/BaseRepository';

export default abstract class PartidoRepository extends BaseRepository<
  Partido,
  number
> {
  abstract findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
  ): Promise<[Partido[], number]>;
}
