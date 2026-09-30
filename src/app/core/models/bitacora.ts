export interface BitacoraCargaResponse {
    bitacoraCargaId: number;
    usuario        : string;
    tabla          : string;
    nombre         : string;
    proceso        : string;
    modificado     : Date;
    registroId     : number;
    totalRegistros : number;
}

export interface BitacoraErrorResponse {
    bitacoraErrorId: number;
    usuario        : string;
    tabla          : string;
    columna        : string;
    mensaje        : string;
    fecha          : Date;
    totalRegistros : number;
}
