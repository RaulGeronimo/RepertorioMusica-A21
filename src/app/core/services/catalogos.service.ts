import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ContinenteResponse,
  EstatusResponse,
  GeneroResponse,
  IdiomaResponse,
  InterpretacionResponse,
  RolResponse,
  TipoVozResponse,
} from '@core/models/catalogos';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  API_URL = `${environment.apiUrl}/Catalogos`;
  constructor(private http: HttpClient) {}

  getRol(): Observable<RolResponse[]> {
    return this.http.get<RolResponse[]>(`${this.API_URL}/Rol`);
  }

  getEstatus(): Observable<EstatusResponse[]> {
    return this.http.get<EstatusResponse[]>(`${this.API_URL}/Estatus`);
  }

  getIdioma(): Observable<IdiomaResponse[]> {
    return this.http.get<IdiomaResponse[]>(`${this.API_URL}/Idioma`);
  }

  getGenero(): Observable<GeneroResponse[]> {
    return this.http.get<GeneroResponse[]>(`${this.API_URL}/Genero`);
  }

  getContinente(): Observable<ContinenteResponse[]> {
    return this.http.get<ContinenteResponse[]>(`${this.API_URL}/Continente`);
  }

  getInterpretacion(): Observable<InterpretacionResponse[]> {
    return this.http.get<InterpretacionResponse[]>(`${this.API_URL}/Interpretacion`);
  }

  getTipoVoz(): Observable<TipoVozResponse[]> {
    return this.http.get<TipoVozResponse[]>(`${this.API_URL}/TipoVoz`);
  }
}
