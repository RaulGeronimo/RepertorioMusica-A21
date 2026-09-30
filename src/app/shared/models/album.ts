export interface Album {
  albumId    ?: number;
  nombre     ?: string;
  grupoId    ?: number;
  disqueraId ?: number;
  duracion   ?: string;
  lanzamiento?: string;
  grabacion  ?: string;
  portada    ?: string;
}

export interface AlbumResponse {
  albumId       : number;
  nombre        : string;
  grupo         : string;
  disquera      : string;
  canciones     : number;
  duracion      : string;
  lanzamiento   : Date;
  grabacion     : string;
  portada       : string;
  totalRegistros: number;
}
