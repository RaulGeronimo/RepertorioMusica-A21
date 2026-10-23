import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';

const RUTAS_PUBLICAS = ['/auth/login', '/auth/refresh-token', '/auth/logout', '/auth/qr/login'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const esPublica = RUTAS_PUBLICAS.some((ruta) => req.url.toLowerCase().includes(ruta));

  const conToken = (peticion: HttpRequest<unknown>) => {
    const token = authService.obtenerToken();
    return token && !esPublica
      ? peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : peticion;
  };

  return next(conToken(req)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || esPublica) {
        return throwError(() => error);
      }

      if (authService.mantenerSesion()) {
        return from(authService.renovarSesion()).pipe(
          switchMap((resultado) => {
            if (resultado === 'ok') {
              return next(conToken(req));
            }
            if (resultado === 'invalida') {
              authService.cerrarSesionInvalida();
            }
            return throwError(() => error);
          }),
        );
      }

      authService.logout();
      return throwError(() => error);
    }),
  );
};
