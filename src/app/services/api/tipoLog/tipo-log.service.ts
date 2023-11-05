import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class TipoLogService {

  private httpOptions = {};

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.setearCabeceras()
  }

  private setearCabeceras() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': `${environment.CONTENT_TYPE}`,
        "Authorization": (this.tokenService.getToken().token) ? `Bearer ${this.tokenService.getToken().token}` : ''
      })
    };
  }

  obtenerTiposLog(): Observable<any> {
    return this.http.get<any>(`${environment.URL_BITACORAS}/apoyo/consultas/tipoLog`, this.httpOptions)
  }
}
