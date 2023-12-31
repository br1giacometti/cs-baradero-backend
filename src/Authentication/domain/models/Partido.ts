import Player from './Player';

export default class Partido {
  numero: number;
  mapa: string;
  equipoCT: Player[];
  equipoTT: Player[];
  rondasCT: number;
  rondasTT: number;
  jornadasGanadas?: number;
  jornadaId?: number;
  id?: number;

  constructor(
    numero: number,
    mapa: string,
    equipoCT: Player[],
    equipoTT: Player[],
    rondasCT: number,
    rondasTT: number,
    jornadasGanadas?: number,
    jornadaId?: number,
    id?: number,
  ) {
    this.numero = numero;
    this.mapa = mapa;
    this.equipoCT = equipoCT;
    this.equipoTT = equipoTT;
    this.rondasCT = rondasCT;
    this.rondasTT = rondasTT;
    this.jornadasGanadas = jornadasGanadas;
    this.jornadaId = jornadaId;
    this.id = id;
  }
}
