import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

@Component({
  selector: 'app-qr-scanner',
  standalone: false,
  templateUrl: './qr-scanner.html',
  styleUrl: './qr-scanner.css',
})
export class QrScanner implements AfterViewInit, OnDestroy {
  @Output() leido = new EventEmitter<string>();
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;

  error = '';
  iniciando = true;
  private controles?: IScannerControls;
  private destruido = false;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.iniciar();
  }

  async iniciar() {
    this.error = '';
    this.iniciando = true;

    try {
      const lector = new BrowserQRCodeReader();
      const controles = await lector.decodeFromVideoDevice(
        undefined,
        this.video.nativeElement,
        (resultado) => {
          if (!resultado) return;
          this.detener();
          this.zone.run(() => this.leido.emit(resultado.getText()));
        },
      );

      if (this.destruido) {
        controles.stop();
      } else {
        this.controles = controles;
      }
    } catch (e) {
      this.error = this.mensajeError(e);
    } finally {
      this.iniciando = false;
      this.cdr.markForCheck();
    }
  }

  private mensajeError(e: unknown): string {
    const nombre = (e as { name?: string })?.name;
    if (nombre === 'NotAllowedError') {
      return 'Permiso de cámara denegado. Actívalo en tu navegador e inténtalo de nuevo.';
    }
    if (nombre === 'NotFoundError') {
      return 'No se encontró ninguna cámara en este dispositivo.';
    }
    return 'No se pudo acceder a la cámara. Verifica que estés usando HTTPS.';
  }

  private detener() {
    this.controles?.stop();
    this.controles = undefined;
  }

  ngOnDestroy(): void {
    this.destruido = true;
    this.detener();
  }
}
