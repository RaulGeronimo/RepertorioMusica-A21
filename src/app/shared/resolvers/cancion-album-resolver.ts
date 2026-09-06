import { ResolveFn } from '@angular/router';

export const cancionAlbumResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
