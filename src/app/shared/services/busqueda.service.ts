import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { GrupoResponse } from '@shared/models/grupo';
import { AlbumResponse } from '@shared/models/album';
import { CancionResponse } from '@shared/models/cancion';
import { ArtistaGrupoResponse } from '@shared/models/artista-grupo';
import { CancionAlbumResponse } from '@shared/models/cancion-album';

@Injectable({
  providedIn: 'root',
})
export class BusquedaService {
  API_URL = `${environment.apiUrl}/Buscar`;

  URL_Grupo = `${this.API_URL}/Grupo`;
  URL_Album = `${this.API_URL}/Album`;

  constructor(private http: HttpClient) {}

  //#region Grupo
  getGrupoId(id: number): Observable<GrupoResponse> {
    return this.http.get<GrupoResponse>(`${this.URL_Grupo}/${id}`);
  }

  getGrupoAlbumes(id: number): Observable<AlbumResponse[]> {
    return this.http.get<AlbumResponse[]>(`${this.URL_Grupo}/Album/${id}`);
  }

  getGrupoCanciones(id: number): Observable<CancionResponse[]> {
    return this.http.get<CancionResponse[]>(`${this.URL_Grupo}/Cancion/${id}`);
  }

  getGrupoIntegrantes(id: number): Observable<ArtistaGrupoResponse[]> {
    return this.http.get<ArtistaGrupoResponse[]>(`${this.URL_Grupo}/Integrante/${id}`);
  }

  exportarExcelGrupo(id: number): Observable<Blob> {
    return this.http.get(`${this.URL_Grupo}/Exportar/${id}`, { responseType: 'blob' });
  }
  //#endregion Grupo

  //#region Album
  getAlbumId(id: number): Observable<AlbumResponse> {
    return this.http.get<AlbumResponse>(`${this.URL_Album}/${id}`);
  }

  getAlbumCanciones(id: number): Observable<CancionAlbumResponse[]> {
    return this.http.get<CancionAlbumResponse[]>(`${this.URL_Album}/Cancion/${id}`);
  }

  exportarExcelAlbum(id: number): Observable<Blob> {
    return this.http.get(`${this.URL_Album}/Exportar/${id}`, { responseType: 'blob' });
  }
  //#endregion Album
}
