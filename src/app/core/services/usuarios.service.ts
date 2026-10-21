import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Usuario, UsuarioResponse } from '@core/models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  API_URL = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  getUsuarios() {
    return this.http.get<UsuarioResponse[]>(`${this.API_URL}`);
  }

  getUsuario() {
    return this.http.get<UsuarioResponse>(`${this.API_URL}/usuario`);
  }

  update(usuarioId: number, usuario: Usuario) {
    return this.http.put(`${this.API_URL}/${usuarioId}`, usuario);
  }

  Validar(filtro: Usuario) {
    return this.http.post<Usuario>(`${this.API_URL}/validar`, filtro);
  }

  exportarExcel() {
    return this.http.get(`${this.API_URL}/Exportar`, { responseType: 'blob' });
  }
}
