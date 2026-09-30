import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Disquera, DisqueraResponse } from '@shared/models/disquera';

@Injectable({
  providedIn: 'root',
})
export class DisqueraService {
  API_URL = `${environment.apiUrl}/Disquera`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<DisqueraResponse[]> {
    return this.http.get<DisqueraResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<Disquera> {
    return this.http.get<Disquera>(`${this.API_URL}/${id}`);
  }

  create(form: Disquera) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: Disquera) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
