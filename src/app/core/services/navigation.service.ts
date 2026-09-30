import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = ['/repertorio'];

  private excludedRoutes = [
    '/agregar',
    '/actualizar',
    '/no-autorizado',
    '/login',
    '/register',
    '/reset',
  ];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;
        const shouldExclude = this.excludedRoutes.some((route) => url.includes(route));

        if (shouldExclude) return;

        const top = this.history[this.history.length - 1];
        if (url !== top) {
          this.history.push(url);
        }
      });
  }

  goBack(): void {
    const currentUrl = this.router.url;
    const top = this.history[this.history.length - 1];

    if (currentUrl === top) {
      this.history.pop();
      const previous = this.history[this.history.length - 1] ?? '/repertorio';
      this.router.navigateByUrl(previous);
    } else {
      this.router.navigateByUrl(top ?? '/repertorio');
    }
  }

  getLastUrl(): string {
    return this.history[this.history.length - 1];
  }

  clear(): void {
    this.history = ['/repertorio'];
  }
}
