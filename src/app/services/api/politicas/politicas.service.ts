import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PoliticasService {

  httpOptions = {};
  constructor(
    private http: HttpClient,
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

  obtenerPolitica(id_politca:Number){
    this.setearCabeceras()
    const url = `${environment.URL_API}/politicas/ver/${id_politca}`
    return this.http.get(url, this.httpOptions)
  }

  obtenerListaVersiones(){
    this.setearCabeceras()
    const url = `${environment.URL_API}/politicas/lista`
    return this.http.get(url, this.httpOptions)
  }

  obtenerListaAceptacion(){
    this.setearCabeceras()
    const url = `${environment.URL_API}/politicas/listaAceptacion`
    return this.http.get(url, this.httpOptions)
  }

  eliminarPolitica(parametros:any){
    this.setearCabeceras()
    const url = `${environment.URL_API}/politicas/eliminar/${parametros.id_politica}/${parametros.id_usuario}`
    return this.http.post(url,{}, this.httpOptions)
  }

  crearPolitica(nueva_politica: any){
    this.setearCabeceras()
    const url = `${environment.URL_API}/politicas/crearPoliticaUso`
    return this.http.post(url, nueva_politica, this.httpOptions)
  }

  aceptarPolitica(body:any){
    this.setearCabeceras()
    const url = `${environment.URL_API}/politicas/aceptarPolitica`
    return this.http.post(url, body, this.httpOptions)
  }

}
