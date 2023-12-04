import Partido from 'Authentication/domain/models/Partido';

export default interface CreateJornadaDto {
  partidos: Partido[];
}
