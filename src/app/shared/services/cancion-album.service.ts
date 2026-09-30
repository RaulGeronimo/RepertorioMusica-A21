import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { CancionAlbum, CancionAlbumResponse } from '@shared/models/cancion-album';

@Injectable({
  providedIn: 'root',
})
export class CancionAlbumService {
  API_URL = `${environment.apiUrl}/CancionAlbum`;

  constructor(private http: HttpClient) {}

  getLista(): Observable<CancionAlbumResponse[]> {
    return this.http.get<CancionAlbumResponse[]>(`${this.API_URL}`);
  }

  getById(id: number): Observable<CancionAlbum> {
    return this.http.get<CancionAlbum>(`${this.API_URL}/${id}`);
  }

  create(form: CancionAlbum) {
    return this.http.post(`${this.API_URL}`, form);
  }

  update(id: number, form: CancionAlbum) {
    return this.http.put(`${this.API_URL}/${id}`, form);
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
