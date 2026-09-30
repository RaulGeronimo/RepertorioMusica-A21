import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ArtistaGrupo, ArtistaGrupoResponse } from '@shared/models/artista-grupo';

@Injectable({
  providedIn: 'root',
})
export class ArtistaGrupoService {
  API_URL = `${environment.apiUrl}/ArtistaGrupo`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<ArtistaGrupoResponse[]> {
    return this.http.get<ArtistaGrupoResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<ArtistaGrupo> {
    return this.http.get<ArtistaGrupo>(`${this.API_URL}/${id}`);
  }

  create(form: ArtistaGrupo) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: ArtistaGrupo) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
