import Puntuacion from './Puntuacion';

export default class Player {
  tag: string;
  firstName: string;
  lastName: string;
  puntuaciones?: Puntuacion[];
  totalPuntos?: number;
  totalPartidos?: number;
  totalGanados: number;
  totalPerdidos?: number;
  totalJornadasGanadas?: number;
  totalJornadasPerdidas?: number;
  totalJornadasEmpatadas?: number;
  id?: number;

  constructor(
    tag: string,
    firstName: string,
    lastName: string,
    puntuaciones?: Puntuacion[],
    totalPuntos?: number,
    totalPartidos?: number,
    totalGanados?: number,
    totalPerdidos?: number,
    totalJornadasGanadas?: number,
    totalJornadasPerdidas?: number,
    totalJornadasEmpatadas?: number,
    id?: number,
  ) {
    this.tag = tag;
    this.firstName = firstName;
    this.lastName = lastName;
    this.puntuaciones = puntuaciones;
    this.totalPuntos = totalPuntos;
    this.totalPartidos = totalPartidos;
    this.totalGanados = totalGanados;
    this.totalPerdidos = totalPerdidos;
    this.totalJornadasGanadas = totalJornadasGanadas;
    this.totalJornadasPerdidas = totalJornadasPerdidas;
    this.totalJornadasEmpatadas = totalJornadasEmpatadas;
    this.id = id;
  }
}
