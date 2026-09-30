export interface Grupo {
  grupoId  ?: number;
  nombre   ?: string;
  origen   ?: string;
  genero   ?: string;
  inicio   ?: string;
  fin      ?: string | null;
  sellos   ?: string;
  estatusId?: number;
  sitioWeb ?: string;
  idiomaId ?: number;
  logo     ?: string;
}

export interface GrupoResponse {
  grupoId       : number;
  nombre        : string;
  albumes       : number;
  canciones     : number;
  origen        : string;
  genero        : string;
  periodo       : string;
  sellos        : string;
  estatus       : string;
  sitioWeb      : string;
  idioma        : string;
  logo          : string;
  totalRegistros: number;
}
