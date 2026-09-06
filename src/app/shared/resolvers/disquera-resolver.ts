import { ResolveFn } from '@angular/router';

export const disqueraResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
