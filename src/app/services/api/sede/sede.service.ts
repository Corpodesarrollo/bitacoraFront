import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

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

  obtenerSedes(body: any): Observable<any> {
    return this.http.post<any>(`${environment.URL_BITACORAS}/api/apoyo/consultas/Sedes`, body, this.httpOptions)
  }
}
