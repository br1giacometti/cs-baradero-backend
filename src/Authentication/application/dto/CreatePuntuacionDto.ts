import Partido from 'Authentication/domain/models/Partido';
import Player from 'Authentication/domain/models/Player';

export default interface CreatePuntuacionDto {
  partido: Partido;
  player: Player;
  puntosObtenidos: number;
  partidoId: number;
}
