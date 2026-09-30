import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequests = 0;
  cargando = signal(false);

  show() {
    this.activeRequests++;
    this.cargando.set(true);
  }

  hide() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.cargando.set(this.activeRequests > 0);
  }
}
