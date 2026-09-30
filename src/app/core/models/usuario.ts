export interface Usuario {
  usuarioId      ?: number;
  usuario        ?: string;
  correo         ?: string;
  nombre         ?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  password       ?: string;
  fechaNacimiento?: string;
  rolId          ?: number;
  activo         ?: boolean;
}

export interface UsuarioResponse {
  usuarioId      : number;
  usuario        : string;
  correo         : string;
  nombreCompleto : string;
  registro       : Date;
  fechaNacimiento: Date;
  edad           : number;
  diasCumple     : string;
  rolId          : number;
  rol            : string;
  activo         : boolean;
  totalRegistros : number;
}