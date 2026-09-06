import { ResolveFn } from '@angular/router';

export const cancionResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
