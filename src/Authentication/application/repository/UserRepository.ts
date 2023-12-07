import User from 'Authentication/domain/models/User';
import BaseRepository from 'Base/repository/BaseRepository';

export default abstract class UserRepository extends BaseRepository<User> {
  findUserByEmail: (email: string) => Promise<User | null>;
}
