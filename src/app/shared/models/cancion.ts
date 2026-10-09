export interface Cancion {
  cancionId       ?: number;
  nombre          ?: string;
  duracion        ?: string;
  publicacion     ?: string;
  genero          ?: string;
  interpretacionId?: number;
  grupoId         ?: number;
  colaboracion    ?: string;
  spotifyId       ?: string;
}

export interface CancionResponse {
  cancionId      : number;
  nombre         : string;
  duracion       : string;
  publicacion    : Date;
  genero         : string;
  interpretacion : string;
  grupo          : string;
  albumes        : string;
  spotifyId     ?: string;
  totalRegistros : number;
}