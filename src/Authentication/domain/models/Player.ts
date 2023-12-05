import Puntuacion from './Puntuacion';

export default class Player {
  tag: string;
  firstName: string;
  lastName: string;
  totalPuntos?: number;
  id?: number;

  constructor(
    tag: string,
    firstName: string,
    lastName: string,
    totalPuntos?: number,
    id?: number,
  ) {
    this.tag = tag;
    this.firstName = firstName;
    this.lastName = lastName;
    this.totalPuntos = totalPuntos;
    this.id = id;
  }
}
