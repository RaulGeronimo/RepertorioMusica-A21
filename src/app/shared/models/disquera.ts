export interface Disquera {
  disqueraId?: number;
  nombre    ?: string;
  fundacion ?: string;
  fundador  ?: string;
  generos   ?: string;
  paisId    ?: number;
  estatusId ?: number;
  logo      ?: string;
}

export interface DisqueraResponse {
  disqueraId    : number;
  nombre        : string;
  fundacion     : Date;
  fundador      : string;
  generos       : string;
  pais          : string;
  estatus       : string;
  logo          : string;
  totalRegistros: number;
}