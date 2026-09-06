import { CanActivateFn } from '@angular/router';

export const permisosGuard: CanActivateFn = (route, state) => {
  return true;
};
