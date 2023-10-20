import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContraseniaService {
  constructor(private http: HttpClient) { }

  recuperarContrasenia(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${environment.URL_API}/apoyo/seguridad/usuario/${idUsuario}/recuperarContrasenia`, {});
  }

  cambiarContrasenia(idUsuario: number, contraseniaActual: string, contraseniaNueva: string, confirmacionContrasenia: string): Observable<any> {
    const body = {
      contrasenia_actual: contraseniaActual,
      contrasenia_nueva: contraseniaNueva,
      confirmacion_contrasenia: confirmacionContrasenia
    };
    return this.http.post<any>(`${environment.URL_API}/apoyo/seguridad/usuario/${idUsuario}/cambiarContrasenia`, body);
  }
}
