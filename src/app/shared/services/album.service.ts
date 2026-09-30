import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Album, AlbumResponse } from '@shared/models/album';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  API_URL = `${environment.apiUrl}/Album`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<AlbumResponse[]> {
    return this.http.get<AlbumResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.API_URL}/${id}`);
  }

  create(form: Album) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: Album) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
