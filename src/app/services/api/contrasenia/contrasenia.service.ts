import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ContraseniaService {
  httpOptions = {};

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
  }


  setearCabeceras() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': `${environment.CONTENT_TYPE}`,
        "Authorization": (this.tokenService.getToken().token) ? `Bearer ${this.tokenService.getToken().token}` : ''
      })
    };
  }

  recuperarContrasenia(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${environment.URL_API}/apoyo/seguridad/usuario/${idUsuario}/recuperarContrasenia`, {});
  }

  cambiarContrasenia(idUsuario: number, contraseniaActual: string, contraseniaNueva: string, confirmacionContrasenia: string): Observable<any> {
    this.setearCabeceras()
    const body = {
      contrasenia_actual: contraseniaActual,
      contrasenia_nueva: contraseniaNueva,
      confirmacion_contrasenia: confirmacionContrasenia
    };
    return this.http.post<any>(`${environment.URL_API}/apoyo/seguridad/usuario/${idUsuario}/cambiarContrasenia`, body, this.httpOptions);
  }
}
