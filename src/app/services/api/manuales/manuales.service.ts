import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ManualesService {

  httpOptions = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) { }

  setearCabeceras() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': `${environment.CONTENT_TYPE}`,
        "Authorization": (this.tokenService.getToken().token) ? `Bearer ${this.tokenService.getToken().token}` : ''
      })
    };
  }

  guardarManual(idCategoria: number, formData: FormData) {
    let http_options = {
      headers: new HttpHeaders({
        "Authorization": (this.tokenService.getToken().token) ? `Bearer ${this.tokenService.getToken().token}` : ''
      })
    };
    const url = `${environment.URL_API}/manuales/guardar/${idCategoria}`;
    return this.http.post(url, formData, http_options);
  }

  eliminarManual(idManual: number) {
    this.setearCabeceras()
    const url = `${environment.URL_API}/manuales/manual/eliminar/${idManual}`;
    return this.http.delete(url, this.httpOptions);
  }

  obtenerCategorias(): Observable<any> {
    this.setearCabeceras()
    return this.http.get<any>(`${environment.URL_API}/manuales/manuales/tipo`, this.httpOptions)
  }

  obtenerManualesPorCategoria(idCategoria: number): Observable<any> {
    this.setearCabeceras()
    return this.http.get<any>(`${environment.URL_API}/manuales/manuales/${idCategoria}`, this.httpOptions)
  }

  obtenerManual(idManual: number) {
    this.setearCabeceras()
    return this.http.get<any>(`${environment.URL_API}/manuales/manual/${idManual}`, this.httpOptions);
  }

}
