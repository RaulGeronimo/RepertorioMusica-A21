import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyTrack } from '@core/models/spotify-track';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  API_URL = `${environment.apiUrl}/Spotify`;
  constructor(private http: HttpClient) {}

  buscar(q: string): Observable<SpotifyTrack[]> {
    return this.http.get<SpotifyTrack[]>(`${this.API_URL}/Buscar`, { params: { q } });
  }
}
