import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Cancion, CancionResponse } from '@shared/models/cancion';

@Injectable({
  providedIn: 'root',
})
export class CancionService {
  API_URL = `${environment.apiUrl}/Cancion`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<CancionResponse[]> {
    return this.http.get<CancionResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<Cancion> {
    return this.http.get<Cancion>(`${this.API_URL}/${id}`);
  }

  create(form: Cancion) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: Cancion) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
