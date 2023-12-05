import Partido from './Partido';
import Player from './Player';

export default class Puntuacion {
  puntosObtenidos: number;
  jugador?: Player;
  partido?: Partido;
  id?: number;

  constructor(
    puntosObtenidos: number,
    jugador: Player,
    partido: Partido,
    id?: number,
  ) {
    this.puntosObtenidos = puntosObtenidos;
    this.jugador = jugador;
    this.partido = partido;
    this.id = id;
  }
}
