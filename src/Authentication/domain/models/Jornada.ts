import Partido from './Partido';

export default class Jornada {
  partidos: Partido[];
  fecha?: Date;
  id?: number;

  constructor(partidos: Partido[], fecha?: Date, id?: number) {
    this.partidos = partidos;
    this.fecha = fecha;
    this.id = id;
  }
}
