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

  obtenerVigencias(institucion_id:any){
    this.setearCabeceras();
    return this.http.get(`${this.URL}/asignacionAcademica/vigencias/${institucion_id}`, this.httpOptions);
  }
  // http://localhost:8080/personal/api/asignacionAcademica/vigencias/539

  obtenerMetodologias(idColegio:any){
    this.setearCabeceras();
    return this.http.get(`${this.URL}/asignacionAcademica/metodologias/${idColegio}`, this.httpOptions)
    // {{URL}}personal/api/asignacionAcademica/metodologias/629
  }

  obtenerDocentes(institucion_id, sede_id, jornada_id, parametros:any){
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

    }
    this.setearCabeceras();
    return this.http.get(`${this.URL}/asignacionAcademica/personal/docente/${institucion_id}/${sede_id}/${jornada_id}${queryString}`, this.httpOptions)
  }

  obtenerDocentesSinAsignacion(institucion_id, sede_id, jornada_id, metodologId, vigencia,  parametros:any){
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

    }
    this.setearCabeceras();
    return this.http.get(`${this.URL}/asignacionAcademica/personal/docente/sinasignacion/${institucion_id}/${sede_id}/${jornada_id}/${metodologId}/${vigencia}${queryString}`, this.httpOptions)
  }

  obtenerintensidadHoraria(parametros?){
    this.setearCabeceras();
    return this.http.get(`${this.URL}/asignacionAcademica/obtener/intensidad/horaria/${parametros.institucion_id}/${parametros.metodologia_id}/${parametros.vigencia}/${parametros.sede_id}/${parametros.jornada_id}/${parametros.documento_docente}`, this.httpOptions)
  }


  eliminarAsignacionAcademica(body:any){
    this.setearCabeceras();

    console.log(body)

    const options = {
      headers: new HttpHeaders({
        'Content-Type': `${environment.CONTENT_TYPE}`,
        "Authorization": (this.tokenService.getToken().token)?`Bearer ${this.tokenService.getToken().token}`:''
      }),
      body: body
    };
    
    return this.http.delete(`${this.URL}/asignacionAcademica/delete/asignacion/academica`, options);
    
  }

  actualizarIntensidadHorario(body:any){
    this.setearCabeceras();
    return this.http.post(`${this.URL}/asignacionAcademica/update/intensidad/docente`,body , this.httpOptions)
  }

  guardarAsignacionAcademica(body:any){
    this.setearCabeceras();
    return this.http.post(`${this.URL}/asignacionAcademica/guardar/asignacion/academica`,body , this.httpOptions)
  }

}
