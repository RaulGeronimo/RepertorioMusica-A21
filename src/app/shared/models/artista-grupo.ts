export interface ArtistaGrupo {
  artistaGrupoId?: number;
  artistaId     ?: number;
  grupoId       ?: number;
  fechaInicio   ?: string;
  fechaFin      ?: string | null;
}

export interface ArtistaGrupoResponse {
  artistaGrupoId : number;
  nombre         : string;
  nombreArtistico: string;
  grupo          : string;
  periodo        : string;
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
