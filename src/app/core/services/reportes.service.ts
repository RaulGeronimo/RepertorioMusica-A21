import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  descargarExcel(blob: Blob, nombre: string): void {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.limpiarNombre(nombre)}_${this.fechaActual()}.xlsx`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }

  private limpiarNombre(nombre: string, max = 100): string {
    const limpio = nombre
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/[\u0000-\u001f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const recortado = limpio.length > max ? limpio.slice(0, max) : limpio;
    return recortado.replace(/[. ]+$/, '') || 'Reporte';
  }

  async leerErrorBlob(err: any): Promise<string> {
    const porDefecto = 'No se pudo generar el reporte.';

    try {
      if (err?.error instanceof Blob) {
        const texto = await err.error.text();
        const json = JSON.parse(texto);
        return json.mensaje ?? json.message ?? porDefecto;
      }
      return err?.error?.mensaje ?? err?.error?.message ?? porDefecto;
    } catch {
      return porDefecto;
    }
  }

  private fechaActual(): string {
    const d = new Date();
    const dos = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}${dos(d.getMonth() + 1)}${dos(d.getDate())}_${dos(d.getHours())}${dos(d.getMinutes())}`;
  }
}
