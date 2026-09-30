export interface Pais {
  paisId      ?: number;
  nombre      ?: string;
  nacionalidad?: string;
  continenteId?: number;
  bandera     ?: string;
}

export interface PaisResponse {
  paisId        : number;
  nombre        : string;
  nacionalidad  : string;
  continente    : string;
  bandera       : string;
  totalRegistros: number;
}