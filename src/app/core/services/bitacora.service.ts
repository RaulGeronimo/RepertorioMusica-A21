import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BitacoraCargaResponse, BitacoraErrorResponse } from '@core/models/bitacora';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BitacoraService {
  API_URL = `${environment.apiUrl}/Bitacora`;

  constructor(private http: HttpClient) {}

  getBitacoraCarga(): Observable<BitacoraCargaResponse[]> {
    return this.http.get<BitacoraCargaResponse[]>(`${this.API_URL}/Carga`);
  }

  getBitacoraCargaUsuario(): Observable<BitacoraCargaResponse[]> {
    return this.http.get<BitacoraCargaResponse[]>(`${this.API_URL}/Carga/Usuario`);
  }

  getBitacoraError(): Observable<BitacoraErrorResponse[]> {
    return this.http.get<BitacoraErrorResponse[]>(`${this.API_URL}/Error`);
  }

  getBitacoraErrorUsuario(): Observable<BitacoraErrorResponse[]> {
    return this.http.get<BitacoraErrorResponse[]>(`${this.API_URL}/Error/Usuario`);
  }

  exportarExcelCarga(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Carga/Exportar`, { responseType: 'blob' });
  }

  exportarExcelError(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Errpr/Exportar`, { responseType: 'blob' });
  }
}
