export interface Permiso {
  usuarioId    : number;
  rolId        : number;
  rol          : string;
  seccionId    : number;
  seccion      : string;
  puedeCrear   : boolean;
  puedeEditar  : boolean;
  puedeEliminar: boolean;
  puedeVer     : boolean;
}
