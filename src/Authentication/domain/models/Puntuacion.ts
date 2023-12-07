import Partido from './Partido';
import Player from './Player';

export default class Puntuacion {
  puntosObtenidos: number;
  partidosGanados: number;
  partidosPerdidos: number;
  jornadasEmpatados: number;
  jornadasGanadas: number;
  jornadasPerdidas: number;
  partidoId?: number;
  jugadorId?: number;
  jugador?: Player;
  partido?: Partido;
  id?: number;

  constructor(
    puntosObtenidos: number,
    partidosGanados: number,
    partidosPerdidos: number,
    jornadasEmpatados: number,
    jornadasGanadas: number,
    jornadasPerdidas: number,
    partidoId?: number,
    jugadorId?: number,
    jugador?: Player,
    partido?: Partido,
    id?: number,
  ) {
    this.puntosObtenidos = puntosObtenidos;
    this.partidosGanados = partidosGanados;
    this.partidosPerdidos = partidosPerdidos;
    this.jornadasEmpatados = jornadasEmpatados;
    this.jornadasGanadas = jornadasGanadas;
    this.jornadasPerdidas = jornadasPerdidas;
    this.partidoId = partidoId;
    this.jugadorId = jugadorId;
    this.jugador = jugador;
    this.partido = partido;
    this.id = id;
  }
}
