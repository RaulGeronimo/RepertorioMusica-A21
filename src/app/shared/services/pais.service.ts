import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Pais, PaisResponse } from '@shared/models/pais';

@Injectable({
  providedIn: 'root',
})
export class PaisService {
  API_URL = `${environment.apiUrl}/Pais`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<PaisResponse[]> {
    return this.http.get<PaisResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<Pais> {
    return this.http.get<Pais>(`${this.API_URL}/${id}`);
  }

  create(form: Pais) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: Pais) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
