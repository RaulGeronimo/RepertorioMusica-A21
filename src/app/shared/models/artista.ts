export interface Artista {
  artistaId      ?: number;
  nombre         ?: string;
  nombreArtistico?: string;
  generoId       ?: number;
  fechaNacimiento?: string;
  fechaFinado    ?: string | null;
  estatura       ?: string;
  paisId         ?: number;
  instrumentos   ?: string;
  tipoVozId      ?: number;
  foto           ?: string;
}

export interface ArtistaResponse {
  artistaId      : number;
  nombre         : string;
  nombreArtistico: string;
  genero         : string;
  fechaNacimiento: Date;
  fechaFinado    : Date | null;
  edad           : number;
  estatura       : number;
  pais           : string;
  instrumentos   : string;
  tipoVoz        : string;
  foto           : string;
  totalRegistros : number;
}
