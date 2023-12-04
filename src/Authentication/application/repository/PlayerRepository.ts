import Player from '../../domain/models/Player';

import BaseRepository from 'Base/repository/BaseRepository';

export default abstract class PlayerRepository extends BaseRepository<
  Player,
  number
> {
  findUserByTag: (tag: string) => Promise<Player | null>;
  abstract findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
  ): Promise<[Player[], number]>;
}
