import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
   providedIn: 'root'
})
export class MensajesService {
   httpOptions = {};

   URL_API: string = environment.URL_API;

   constructor(private http: HttpClient,
      private tokenService: TokenService
   ) { }

   setearCabeceras(){
      this.httpOptions = {
      headers: new HttpHeaders({
         'Content-Type': `${environment.CONTENT_TYPE}`,
         "Authorization": (this.tokenService.getToken().token)?`Bearer ${this.tokenService.getToken().token}`:''
      })
      };
   }

   obtenerMensajes(parametros: any) {
      //console.log("Prametros: ", parametros);
      let queryString = "";
      if (parametros) {
         queryString = "?";
         if (parametros.perfilId) {
            if (queryString != "?") queryString += "&";
            queryString += "perfilId=" + parametros.perfilId;
         } else {
            queryString += "&perfilId=" 
         } 
         if (parametros.perfilLoginId) {
            if (queryString != "?") queryString += "&";
            queryString += "perfilLoginId=" + parametros.perfilLoginId;
         } else {
            queryString += "&perfilLoginId=" 
         } 
         if (parametros.localidadId) {
            queryString += "&localidadId=" + parametros.localidadId
         }else{
            queryString += "&localidadId=";
         }
         if (parametros.colegioId) {
            if (queryString != "?") queryString += "&";
            queryString += "colegioId=" + parametros.colegioId
         } else {
            queryString += "&colegioId="
         }
         // if (parametros.asunto) {
         //    if (queryString != "?") queryString += "&";
         //    queryString += "asunto=" + parametros.asunto
         // } else {
         //    queryString += "&asunto="
         // }
         if (parametros.registros_x_pagina) {
            if (queryString != "?") queryString += "&";
            queryString += "registros_x_pagina=" + parametros.registros_x_pagina
         } 
         if (parametros.numpagina) {
            if (queryString != "?") queryString += "&";
            queryString += "numpagina=" + parametros.numpagina
         }
         if (parametros.usuarioId) {
            if (queryString != "?") queryString += "&";
            queryString += "usuarioId=" + parametros.usuarioId
         } else {
            queryString += "&usuarioId="
         }
          if (parametros.jornadaId) {
            if (queryString != "?") queryString += "&";
            queryString += "jornadaId=" + parametros.jornadaId
         } else {
            queryString += "&jornadaId="
         }
         if (parametros.sedeId) {
            if (queryString != "?") queryString += "&";
            queryString += "sedeId=" + parametros.sedeId
         } else {
            queryString += "&sedeId="
         }
         if (parametros.bandera) {
            if (queryString != "?") queryString += "&";
            queryString += "bandera=" + parametros.bandera
         } 
         if (parametros.fechaInicio) {
            queryString += "&fechaDesde=" + parametros.fechaInicio
         }else{
            queryString += "&fechaDesde=";
         }
         if (parametros.fechaFinal) {
            queryString += "&fechaHasta=" + parametros.fechaFinal
         }else{
            queryString += "&fechaHasta=";
         }
         if(parametros.pagina){
            if(queryString != "?") queryString += "&"
            queryString += "pagina=" + parametros.pagina
         }
         if(parametros.size != null){
            if(queryString!="?") queryString+="&";
            queryString+="size="+parametros.size
          }
      }
      this.setearCabeceras();
      return this.http.get(`${this.URL_API}/apoyo/mensajes/mensaje${queryString}`, this.httpOptions)
   }

   obtenerMensaje(id: string) {
      this.setearCabeceras();
      return this.http.get(`${this.URL_API}/apoyo/mensajes/mensaje/${id}`, this.httpOptions)
   }

   obtenerMensajeCompleto(id: string) {
      this.setearCabeceras();
      return this.http.get(`${this.URL_API}/apoyo/mensajes/mensajeActualizar/${id}`, this.httpOptions)
   }

   obtenerPerfiles() {
      this.setearCabeceras();
      return this.http.get(`${this.URL_API}/apoyo/mensajes/lista/perfiles`, this.httpOptions)
   }

   obtenerLocalidades() {
      this.setearCabeceras();
      return this.http.get(`${this.URL_API}/apoyo/mensajes/lista/localidades`, this.httpOptions)
   }

   obtenerColegios(id: any) {
      this.setearCabeceras();
      return this.http.get(`${this.URL_API}/apoyo/mensajes/lista/colegios/${id}`, this.httpOptions)
   }

   obtenerSedes(id: any) {
      this.setearCabeceras();
      return this.http.get(`${this.URL_API}/apoyo/mensajes/lista/sedes/${id}`, this.httpOptions)
   }

   obtenerJornada(id_colegio: any, id_sede: any) {
      this.setearCabeceras();
      return this.http.get(`${this.URL_API}/apoyo/mensajes/lista/jornadas/${id_colegio}/${id_sede}`, this.httpOptions)
   }

   crearMensaje(id: any, perfilId:number, body: any) {
      this.setearCabeceras();
      return this.http.post(`${this.URL_API}/apoyo/mensajes/mensaje/crearMensaje/?usuarioId=${id}&perfilLoginId=${perfilId}`, body, {
         ...this.httpOptions,
         observe: 'response'
       });
   }

   editarMensaje(id_mensaje: any, id_usuario: any, perfilId:number, body: any) {
      this.setearCabeceras();
      return this.http.post(`${this.URL_API}/apoyo/mensajes/mensaje/actualizar/${id_mensaje}/?usuarioId=${id_usuario}&perfilLoginId=${perfilId}`, body,  {
         ...this.httpOptions,
         observe: 'response'
       })
   }

   eliminarMensaje(id: any,usuarioId:any, perfilId:number) {
      this.setearCabeceras();
      return this.http.post(`${this.URL_API}/apoyo/mensajes/mensaje/eliminar/${id}/?usuarioId=${usuarioId}&perfilLoginId=${perfilId}`, id,  {
         ...this.httpOptions,
         observe: 'response'
       })
      // /mensaje/eliminar/{id}/{usuarioId}
   }

}
