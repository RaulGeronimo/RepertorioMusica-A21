import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Permiso } from '@core/models/permiso';
import { Usuario } from '@core/models/usuario';
import { environment } from '@environments/environment';
import { firstValueFrom, interval, Observable, Subscription } from 'rxjs';
import { AlertasService } from './alertas.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiraEn: string;
  mantenerSesion: boolean;
  permisos: Permiso[];
}

export interface QrGenerarResponse {
  contenido: string;
  segundos: number;
}

export type ResultadoRenovacion = 'ok' | 'invalida' | 'red';

interface JwtPayload {
  Usuario: string;
  Permisos: string[];
}

const RENOVAR_ANTES_MS = 2 * 60 * 1000;
const REINTENTO_RED_MS = 15 * 1000;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URI = `${environment.apiUrl}/Auth`;
  private tokenCheckInterval: Subscription | null = null;
  private renovacionEnCurso: Promise<ResultadoRenovacion> | null = null;
  private proximoIntento = 0;

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

  login(user: Usuario, mantenerSesion: boolean = false): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URI}/login`, { ...user, mantenerSesion });
  }

  //#region QR
  generarQr(): Observable<QrGenerarResponse> {
    return this.http.post<QrGenerarResponse>(`${this.API_URI}/qr/generar`, {});
  }

  loginConQr(contenido: string, mantenerSesion: boolean = false): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URI}/qr/login`, { contenido, mantenerSesion });
  }
  //#endregion QR

  //#region Metodos
  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.API_URI}/logout`, { refreshToken }).subscribe({ error: () => {} });
    }

    // localStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiraEn');
    localStorage.removeItem('mantenerSesion');

    if (this.tokenCheckInterval) {
      this.tokenCheckInterval.unsubscribe();
      this.tokenCheckInterval = null;
    }
    this.router.navigate(['login']);
  }

  cerrarSesionInvalida() {
    this.logout();
    this.alerta.mostrarAlertaSimple(
      'Sesión finalizada',
      'Tu sesión ya no es válida. Inicia sesión nuevamente.',
      'info',
    );
  }

  guardarTokens(
    accessToken: string,
    refreshToken: string,
    expiraEn: string,
    mantenerSesion?: boolean,
  ) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiraEn', expiraEn);
    if (mantenerSesion !== undefined) {
      localStorage.setItem('mantenerSesion', mantenerSesion ? '1' : '0');
    }
    this.iniciarChequeoExpiracion();
  }

  obtenerToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  mantenerSesion(): boolean {
    return localStorage.getItem('mantenerSesion') === '1';
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

      if (this.mantenerSesion()) {
        if (
          diferencia <= RENOVAR_ANTES_MS &&
          !this.renovacionEnCurso &&
          ahora >= this.proximoIntento
        ) {
          this.renovarEnSegundoPlano();
        }
        return;
      }

      if (diferencia <= 0) {
        this.logout();
        this.alerta.mostrarAlertaSimple('Sesión Expirada', 'Tu sesión ha terminado.', 'info');
      } else if (diferencia <= 5000) {
        this.tokenCheckInterval?.unsubscribe();
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

  private async renovarToken() {
    const resultado = await this.renovarSesion();

    if (resultado === 'ok') {
      this.alerta.mostrarAlertaSimple('Sesión renovada', 'Tu sesión ha sido extendida.', 'success');
      this.iniciarChequeoExpiracion();
    } else {
      this.logout();
      this.alerta.mostrarAlertaSimple('Sesión finalizada', 'No se pudo renovar el token.', 'error');
    }
  }

  private async renovarEnSegundoPlano() {
    const resultado = await this.renovarSesion();

    if (resultado === 'invalida') {
      this.cerrarSesionInvalida();
    } else if (resultado === 'red') {
      this.proximoIntento = Date.now() + REINTENTO_RED_MS;
    }
  }

  renovarSesion(): Promise<ResultadoRenovacion> {
    if (!this.renovacionEnCurso) {
      this.renovacionEnCurso = this.ejecutarRenovacion().finally(() => {
        this.renovacionEnCurso = null;
      });
    }
    return this.renovacionEnCurso;
  }

  private async ejecutarRenovacion(): Promise<ResultadoRenovacion> {
    const refreshEnviado = localStorage.getItem('refreshToken');
    if (!refreshEnviado) return 'invalida';

    const renovar = async (): Promise<ResultadoRenovacion> => {
      if (localStorage.getItem('refreshToken') !== refreshEnviado) return 'ok';

      try {
        const res = await firstValueFrom(
          this.http.post<LoginResponse>(`${this.API_URI}/refresh-token`, {
            refreshToken: refreshEnviado,
          }),
        );
        this.guardarTokens(res.accessToken, res.refreshToken, res.expiraEn, res.mantenerSesion);
        return 'ok';
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return localStorage.getItem('refreshToken') !== refreshEnviado ? 'ok' : 'invalida';
        }
        return 'red';
      }
    };

    return 'locks' in navigator ? navigator.locks.request('renovar-sesion', renovar) : renovar();
  }

  private verificarExpiracionInicial() {
    const expiraEn = localStorage.getItem('expiraEn');
    if (!expiraEn) return;

    const expiracion = new Date(expiraEn).getTime();
    const ahora = new Date().getTime();

    if (expiracion <= ahora && !this.mantenerSesion()) {
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
