import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const permisosGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const seccion = route.data['seccion'];
  const permiso = route.data['permiso'];
  const permisosMultiples = route.data['permisos'];

  if (Array.isArray(permisosMultiples)) {
    const tieneTodos = permisosMultiples.every((p: any) =>
      authService.tienePermiso(p.seccion, p.permiso),
    );

    if (tieneTodos) return true;

    return router.createUrlTree(['no-autorizado']);
  }

  if (!seccion || !permiso) return true;

  if (authService.tienePermiso(seccion, permiso)) {
    return true;
  }

  return router.createUrlTree(['no-autorizado']);
};
