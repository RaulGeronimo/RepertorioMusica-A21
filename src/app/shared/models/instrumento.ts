export interface Instrumento {
  instrumentoId?: number;
  nombre       ?: string;
  descripcion  ?: string;
  foto         ?: string;
}

export interface InstrumentoResponse {
  instrumentoId : number;
  nombre        : string;
  descripcion   : string;
  foto          : string;
  totalRegistros: number;
}
