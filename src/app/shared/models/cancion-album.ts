export interface CancionAlbum {
  cancionAlbumId?: number;
  albumId       ?: number;
  cancionId     ?: number;
  numero        ?: number;
}

export interface CancionAlbumResponse {
  cancionAlbumId: number;
  album         : string;
  cancion       : string;
  numero        : number;
  duracion      : string;
  publicacion   : Date;
  genero        : string;
  interpretacion: string;
  grupo         : string;
  spotifyId     ?: string;
  totalRegistros: number;
}