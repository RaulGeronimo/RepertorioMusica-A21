import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, signal } from '@angular/core';
import { AlertasService } from '@core/services/alertas.service';
import { AuthService } from '@core/services/auth.service';
import { interval, Subscription } from 'rxjs';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-acceso',
  standalone: false,
  templateUrl: './qr-acceso.html',
  styleUrl: './qr-acceso.css',
})
export class QrAcceso implements OnDestroy {
  qrImagen = signal<string | null>(null);
  segundosRestantes = signal(0);
  cargando = signal(false);
  expirado = signal(false);

  private cuenta: Subscription | null = null;

  constructor(
    private service: AuthService,
    private alerta: AlertasService,
  ) {}

  generar() {
    this.cargando.set(true);
    this.expirado.set(false);

    this.service.generarQr().subscribe({
      next: async (res) => {
        try {
          this.qrImagen.set(
            await QRCode.toDataURL(res.contenido, {
              width: 260,
              margin: 1,
              errorCorrectionLevel: 'M',
            }),
          );
          this.iniciarCuenta(res.segundos);
        } finally {
          this.cargando.set(false);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this.alerta.manejarError(err, 'No se pudo generar el código QR');
      },
    });
  }

  ocultar() {
    this.detenerCuenta();
    this.qrImagen.set(null);
  }

  private iniciarCuenta(segundos: number) {
    this.detenerCuenta();
    const fin = Date.now() + segundos * 1000;
    this.segundosRestantes.set(segundos);

    this.cuenta = interval(250).subscribe(() => {
      const restantes = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      this.segundosRestantes.set(restantes);

      if (restantes === 0) {
        this.detenerCuenta();
        this.qrImagen.set(null);
        this.expirado.set(true);
      }
    });
  }

  private detenerCuenta() {
    this.cuenta?.unsubscribe();
    this.cuenta = null;
  }

  ngOnDestroy(): void {
    this.detenerCuenta();
  }
}
