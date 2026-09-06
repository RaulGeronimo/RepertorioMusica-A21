import { ResolveFn } from '@angular/router';

export const paisResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
