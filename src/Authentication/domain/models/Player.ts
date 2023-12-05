import Puntuacion from './Puntuacion';

export default class Player {
  tag: string;
  firstName: string;
  lastName: string;
  puntuaciones?: Puntuacion[];
  totalPuntos?: number;
  id?: number;

  constructor(
    tag: string,
    firstName: string,
    lastName: string,
    puntuaciones?: Puntuacion[],
    totalPuntos?: number,
    id?: number,
  ) {
    this.tag = tag;
    this.firstName = firstName;
    this.lastName = lastName;
    this.puntuaciones = puntuaciones;
    this.totalPuntos = totalPuntos;
    this.id = id;
  }
}
