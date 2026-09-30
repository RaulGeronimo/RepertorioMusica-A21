import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Permiso } from '@core/models/permiso';
import { Usuario } from '@core/models/usuario';
import { environment } from '@environments/environment';
import { interval, Observable, Subscription } from 'rxjs';
import { AlertasService } from './alertas.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiraEn: string;
  permisos: Permiso[];
}

interface JwtPayload {
  Usuario: string;
  Permisos: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URI = `${environment.apiUrl}/Auth`;
  private tokenCheckInterval: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private alerta: AlertasService,
    private router: Router,
  ) {
    this.verificarExpiracionInicial();
    this.escucharCambiosEnOtrasPestañas();
  }

  private escucharCambiosEnOtrasPestañas() {
    window.addEventListener('storage', (event) => {
      if (event.key === null || (event.key === 'accessToken' && !event.newValue)) {
        this.cerrarSesionPorOtraPestaña();
      }
    });
  }

  private cerrarSesionPorOtraPestaña() {
    if (this.tokenCheckInterval) {
      this.tokenCheckInterval.unsubscribe();
      this.tokenCheckInterval = null;
    }
    this.router.navigate(['login']);
  }

  create(user: Usuario) {
    return this.http.post(`${this.API_URI}`, user);
  }

  login(user: Usuario): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URI}/login`, user);
  }

  //#region Metodos
  logout() {
    // localStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiraEn');

    if (this.tokenCheckInterval) {
      this.tokenCheckInterval.unsubscribe();
      this.tokenCheckInterval = null;
    }
    this.router.navigate(['login']);
  }

  guardarTokens(accessToken: string, refreshToken: string, expiraEn: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiraEn', expiraEn);
    this.iniciarChequeoExpiracion();
  }

  obtenerToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  //#region Permisos
  obtenerPermisos(): Permiso[] {
    const token = this.obtenerToken();
    if (!token) return [];

    try {
      const payload = jwtDecode<JwtPayload>(token);
      return this.parsePermisos(payload.Permisos ?? []);
    } catch {
      return [];
    }
  }

  private parsePermisos(raw: string[]): Permiso[] {
    return raw.map((item) => {
      const [seccionIdStr, seccion, propsStr] = item.split('|');
      const props: Record<string, boolean> = {};

      propsStr.split(',').forEach((pair) => {
        const [key, value] = pair.split(':');
        props[key.trim()] = value.trim().toLowerCase() === 'true';
      });

      return {
        seccionId: Number(seccionIdStr),
        seccion: seccion.trim(),
        puedeCrear: props['crear'] ?? false,
        puedeEditar: props['editar'] ?? false,
        puedeEliminar: props['eliminar'] ?? false,
        puedeVer: props['ver'] ?? false,
      } as Permiso;
    });
  }

  tienePermiso(seccion: string, permiso: keyof Permiso): boolean {
    const permisos = this.obtenerPermisos();
    const seccionEncontrada = permisos.find((p) => p.seccion === seccion);
    return !!seccionEncontrada?.[permiso];
  }
  //#endregion Permisos

  private iniciarChequeoExpiracion() {
    if (this.tokenCheckInterval) {
      this.tokenCheckInterval.unsubscribe();
    }

    this.tokenCheckInterval = interval(1000).subscribe(() => {
      const expiraEn = localStorage.getItem('expiraEn');
      if (!expiraEn) return;

      const expiracion = new Date(expiraEn).getTime();
      const ahora = new Date().getTime();
      const diferencia = expiracion - ahora;

      if (diferencia <= 0) {
        this.logout();
        this.alerta.mostrarAlertaSimple('Sesión Expirada', 'Tu sesión ha terminado.', 'info');
      } else if (diferencia <= 5000) {
        this.tokenCheckInterval?.unsubscribe(); // Evita múltiples alertas
        this.mostrarAlertaRenovacion();
      }
    });
  }

  private mostrarAlertaRenovacion() {
    this.alerta
      .mostrarAlertaConfirmacion(
        '¿Deseas continuar en la sesión?',
        'Tu sesión está por expirar.',
        'Sí, continuar',
        'No, cerrar sesión',
      )
      .then((result) => {
        if (result) {
          this.renovarToken();
        } else {
          this.logout();
        }
      });
  }

  private renovarToken() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      this.logout();
      return;
    }

    this.http
      .post<LoginResponse>(`${this.API_URI}/refresh-token`, {
        accessToken,
        refreshToken,
      })
      .subscribe({
        next: (res) => {
          this.guardarTokens(res.accessToken, res.refreshToken, res.expiraEn);
          this.alerta.mostrarAlertaSimple(
            'Sesión renovada',
            'Tu sesión ha sido extendida.',
            'success',
          );
          this.iniciarChequeoExpiracion();
        },
        error: () => {
          this.logout();
          this.alerta.mostrarAlertaSimple(
            'Sesión finalizada',
            'No se pudo renovar el token.',
            'error',
          );
        },
      });
  }

  private verificarExpiracionInicial() {
    const expiraEn = localStorage.getItem('expiraEn');
    if (!expiraEn) return;

    const expiracion = new Date(expiraEn).getTime();
    const ahora = new Date().getTime();

    if (expiracion <= ahora) {
      this.logout();
      this.alerta.mostrarAlertaSimple(
        'Sesión expirada',
        'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        'info',
      );
    } else {
      this.iniciarChequeoExpiracion();
    }
  }
  //#endregion Metodos

  //#region Extraer datos Usuario
  obtenerDatosUsuario(): Usuario | null {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      const payload = jwtDecode<JwtPayload>(token);
      return {
        usuario: payload.Usuario,
      };
    } catch {
      return null;
    }
  }
  //#endregion Extraer datos Usuario
}
