export interface InstrumentoArtista {
  instrumentoArtistaGrupoId?: number;
  artistaId                ?: number;
  instrumentoId            ?: number;
}

export interface InstrumentoArtistaResponse {
  instrumentoArtistaGrupoId: number;
  nombre                   : string;
  nombreArtistico          : string;
  grupo                    : string;
  instrumento              : string;
  foto                     : string;
  totalRegistros           : number;
}