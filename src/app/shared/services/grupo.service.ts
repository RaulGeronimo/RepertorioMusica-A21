import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Grupo, GrupoResponse } from '@shared/models/grupo';

@Injectable({
  providedIn: 'root',
})
export class GrupoService {
  API_URL = `${environment.apiUrl}/Grupo`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<GrupoResponse[]> {
    return this.http.get<GrupoResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.API_URL}/${id}`);
  }

  create(form: Grupo) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: Grupo) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
