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
    this.setearCabeceras();
    const url = `${environment.URL_API}/apoyo/politicas/ver/${id_politca}`
    return this.http.get(url, this.httpOptions);
  }

  obtenerPoliticaActiva(){
    this.setearCabeceras();
    const url = `${environment.URL_API}/apoyo/politicas/lista/politicasActivas`
    return this.http.get(url, this.httpOptions);
  }

  obtenerListaVersiones(){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/lista`
    return this.http.get(url, this.httpOptions);
  }

  obtenerListaAceptacion(){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/listaAceptacion`
    return this.http.get(url, this.httpOptions);
  }

  eliminarPolitica(parametros:any){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/eliminar/${parametros.id_politica}/${parametros.id_usuario}`
    return this.http.post(url,{}, {
      ...this.httpOptions,
      observe: 'response'
    })
  }

  crearPolitica(nueva_politica: any){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/crearPoliticaUso`
    return this.http.post(url, nueva_politica, this.httpOptions)
  }

  aceptarPoliticas(body:any){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/aceptarPolitica`
    return this.http.post(url, body, this.httpOptions)
  }

  consultarTienePoliticaUso(id_usuario:string){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/aceptacionPoliticaUso/${id_usuario}`
    return this.http.get(url,  this.httpOptions)
  }

  consultarTienePoliticaDatos(id_usuario:string){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/aceptacionPoliticaDatos/${id_usuario}`
    return this.http.get(url,  this.httpOptions)
  }

  reenviarPoliticasDatos(){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/marcarReenviarPoliticaDatos`
    return this.http.post(url, {}, {
      ...this.httpOptions,
      observe: 'response'
    })
  }

  reenviarPoliticasUso(){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/politicas/marcarReenviarPoliticaUso`
    return this.http.post(url, {}, {
      ...this.httpOptions,
      observe: 'response'
    })
  }

}
