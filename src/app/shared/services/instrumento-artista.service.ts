import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { InstrumentoArtista, InstrumentoArtistaResponse } from '@shared/models/instrumento-artista';

@Injectable({
  providedIn: 'root',
})
export class InstrumentoArtistaService {
  API_URL = `${environment.apiUrl}/InstrumentoArtistaGrupo`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<InstrumentoArtistaResponse[]> {
    return this.http.get<InstrumentoArtistaResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<InstrumentoArtista> {
    return this.http.get<InstrumentoArtista>(`${this.API_URL}/${id}`);
  }

  create(form: InstrumentoArtista) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: InstrumentoArtista) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
