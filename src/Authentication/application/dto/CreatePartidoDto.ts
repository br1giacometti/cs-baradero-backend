import Player from 'Authentication/domain/models/Player';

export default interface CreatePartidoDto {
  partido: number;
  mapa: string;
  equipoCT: Player[];
  equipoTT: Player[];
}
