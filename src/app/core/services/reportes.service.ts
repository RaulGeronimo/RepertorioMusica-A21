import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  descargarExcel(blob: Blob, nombre: string): void {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombre}.xlsx`;

    a.click();

    window.URL.revokeObjectURL(url);
  }
}
