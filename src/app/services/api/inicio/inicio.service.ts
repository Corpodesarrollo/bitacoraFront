import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  httpOptions = {};

  constructor(
    private http: HttpClient,
    private authService: MsalService,
    private router: Router,
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

  obtenerAccesosRapidos(perfil_id: number){
    this.setearCabeceras();
    const url = `${environment.URL_API}/apoyo/usuarios/accesos-directos/${perfil_id}`
    return this.http.get(url, this.httpOptions)
  }

  obtenerListaColegios(parametros:any){
    this.setearCabeceras();
    const url = `${environment.URL_API}/apoyo/consultas/colegios/${parametros.localidad}/${parametros.numero_pagina}/${parametros.tamano_pagina}`
    return this.http.get(url, this.httpOptions)
  }

  obtenerListaEstudiantes(parametros:any){
    this.setearCabeceras();
    const url = `${environment.URL_API}/apoyo/consultas/estudiantes/institucion/${parametros.id_colegio}/${parametros.id_Sede}/${parametros.id_jornada}/${parametros.numero_pagina}/${parametros.tamano_pagina}`
    return this.http.get(url, this.httpOptions)
  }
}
