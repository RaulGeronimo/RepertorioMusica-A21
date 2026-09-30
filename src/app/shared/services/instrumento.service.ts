import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Instrumento, InstrumentoResponse } from '@shared/models/instrumento';

@Injectable({
  providedIn: 'root',
})
export class InstrumentoService {
  API_URL = `${environment.apiUrl}/Instrumento`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<InstrumentoResponse[]> {
    return this.http.get<InstrumentoResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<Instrumento> {
    return this.http.get<Instrumento>(`${this.API_URL}/${id}`);
  }

  create(form: Instrumento) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: Instrumento) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
