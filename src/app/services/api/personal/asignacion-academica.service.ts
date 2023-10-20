import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AsignacionAcademicaService {

  URL = environment.URL_API_PERSONAL;
  httpOptions = {};

  constructor(
    private http: HttpClient,
    private tokenService: TokenService) { }

  setearCabeceras(){
    this.httpOptions = {
    headers: new HttpHeaders({
       'Content-Type': `${environment.CONTENT_TYPE}`,
       "Authorization": (this.tokenService.getToken().token)?`Bearer ${this.tokenService.getToken().token}`:''
    })
    };
 }

  obtenerVigencias(){
    this.setearCabeceras();
    return this.http.get(`${this.URL}/asignacionAcademica/vigencias`, this.httpOptions);
  }

  obtenerMetodologias(idColegio:any){
    this.setearCabeceras();
    return this.http.get(`${this.URL}/asignacionAcademica/metodologias/${idColegio}`, this.httpOptions)
    // {{URL}}personal/api/asignacionAcademica/metodologias/629
  }

  obtenerDocentes(institucion_id, cede_id, jornada_id, parametros:any){
    let queryString= "";
    if(parametros){
      queryString="?";
      if(parametros.sort  != null){
        if(queryString!="?") queryString +="&";
        queryString +="sort="+parametros.sort;
      }
      if(parametros.size != null){
        if(queryString!="?") queryString+="&";
        queryString+="size="+parametros.size
      }
      if(parametros.page  != null){
        if(queryString!="?") queryString+="&";
        queryString+="page="+parametros.page
      }
      if(parametros.id_vigencia  != null){
        if(queryString!="?") queryString+="&";
        queryString+="Vigencia="+parametros.id_vigencia
      }
      if(parametros.id_sede  != null){
        if(queryString!="?") queryString+="&";
        queryString+="sedeId="+parametros.id_sede
      }
      if(parametros.id_jornada  != null){
        if(queryString!="?") queryString+="&";
        queryString+="JornadaI="+parametros.id_jornada
      }
      if(parametros.id_metodologia  != null){
        if(queryString!="?") queryString+="&";
        queryString+="Metodologia="+parametros.id_metodologia
      }
  
    }
    this.setearCabeceras();
    return this.http.get(`${this.URL}/asignacionAcademica/personal/docente/${institucion_id}/${cede_id}/${jornada_id}${queryString}`, this.httpOptions)
  }

}
