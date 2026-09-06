import { ResolveFn } from '@angular/router';

export const albumResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
