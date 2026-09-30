import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Artista, ArtistaResponse } from '@shared/models/artista';

@Injectable({
  providedIn: 'root',
})
export class ArtistaService {
  API_URL = `${environment.apiUrl}/Artista`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<ArtistaResponse[]> {
    return this.http.get<ArtistaResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<Artista> {
    return this.http.get<Artista>(`${this.API_URL}/${id}`);
  }

  create(form: Artista) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: Artista) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
