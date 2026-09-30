import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'app-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly temasDisponibles = ['light', 'dark'];

  temaActual = signal<string>(this.obtenerTemaInicial());

  constructor() {
    this.aplicarTema(this.temaActual());
  }

  private obtenerTemaInicial(): string {
    const guardado = localStorage.getItem(THEME_KEY);
    if (guardado && this.temasDisponibles.includes(guardado)) {
      return guardado;
    }
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefiereOscuro ? 'dark' : 'light';
  }

  toggleTema(): void {
    const nuevo = this.temaActual() === 'dark' ? 'light' : 'dark';
    this.cambiarTema(nuevo);
  }

  cambiarTema(tema: string): void {
    if (!this.temasDisponibles.includes(tema)) return;
    this.temaActual.set(tema);
    this.aplicarTema(tema);
    localStorage.setItem(THEME_KEY, tema);
  }

  private aplicarTema(tema: string): void {
    document.documentElement.setAttribute('data-bs-theme', tema);
    document.documentElement.style.setProperty('color-scheme', tema);
  }
}
