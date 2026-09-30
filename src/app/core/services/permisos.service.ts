import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  constructor(private authService: AuthService) {}

  private get permisos() {
    return this.authService.obtenerPermisos();
  }

  puedeVer(seccionId: number): boolean {
    return this.permisos.some((p) => p.seccionId === seccionId && p.puedeVer);
  }

  puedeCrear(seccionId: number): boolean {
    return this.permisos.some((p) => p.seccionId === seccionId && p.puedeCrear);
  }

  puedeEditar(seccionId: number): boolean {
    return this.permisos.some((p) => p.seccionId === seccionId && p.puedeEditar);
  }

  puedeEliminar(seccionId: number): boolean {
    return this.permisos.some((p) => p.seccionId === seccionId && p.puedeEliminar);
  }
}
