import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
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

  obtenerPerfiles() {
    this.setearCabeceras();

    return this.http.get(`${environment.URL_API_PERSONAL}/personal/profile`, this.httpOptions);
  }

  obtenerPerfilesPorTipo() {
    this.setearCabeceras();
    return this.http.get(`${environment.URL_API_PERSONAL}/personal/tipo/profile`, this.httpOptions);

  }

  obtenerSedes(idColegio: number) {
    this.setearCabeceras();
    return this.http.get(`${environment.URL_API_PERSONAL}/sede/sedes/${idColegio}`, this.httpOptions)
  }

  obtenerJonadaPorSede(parametros: any) {
    this.setearCabeceras();
    return this.http.get(`${environment.URL_API}/apoyo/mensajes/lista/jornadas/${parametros.id_colegio}/${parametros.id_sede}`, {
      ...this.httpOptions,
      observe: 'response'
    })
  }

  obtenerDatosFiltrados(parametros: any, parametrosPagina: any) {
    let queryString = "";
    if (parametros || parametrosPagina) {
      queryString = "?";
      if (parametros.sede!=null) {
        if (queryString != "?") queryString += "&";
        queryString += "sede=" + parametros.sede;
      }
      if (parametros.jornada!=null) {
        if (queryString != "?") queryString += "&";
        queryString += "jornada=" + parametros.jornada
      }
      if (parametros.tipo_personal) {
        if (queryString != "?") queryString += "&";
        queryString += "tipoPersonal=" + parametros.tipo_personal
      }
      if (parametros.identificacion) {
        if (queryString != "?") queryString += "&";
        queryString += "identifacion=" + parametros.identificacion
      }
      if (parametros.primer_nombre) {
        if (queryString != "?") queryString += "&";
        queryString += "primerNombre=" + parametros.primer_nombre
      }
      if (parametros.segundo_nombre) {
        if (queryString != "?") queryString += "&";
        queryString += "segundoNombre=" + parametros.segundo_nombre
      }
      if (parametros.primer_apellido) {
        if (queryString != "?") queryString += "&";
        queryString += "primerApellido=" + parametros.primer_apellido
      }
      if (parametros.segundo_apellido) {
        if (queryString != "?") queryString += "&";
        queryString += "segundoApellido=" + parametros.segundo_apellido
      }
      if (parametros.institucion) {
        if (queryString != "?") queryString += "&";
        queryString += "institucion=" + parametros.institucion
      }
      if (parametrosPagina.pagina === 0 || parametrosPagina.pagina) {
        if (queryString != "?") queryString += "&";
        queryString += "page=" + parametrosPagina.pagina
      }
      if (parametrosPagina.size) {
        if (queryString != "?") queryString += "&";
        queryString += "size=" + parametrosPagina.size
      }
      if (parametrosPagina.sort) {
        if (queryString != "?") queryString += "&";
        queryString += "sort=" + parametrosPagina.sort
      }
    }
    this.setearCabeceras();
    const url = `${environment.URL_API_PERSONAL}/personal/list/${queryString}`;
    return this.http.get(url,
      {
        ...this.httpOptions,
        observe: 'response'
      })
  }


  obtenerDatosSimple(parametros: any) {
    let queryString = "";
    if (parametros) {
      queryString = "?";
      if (parametros.sede != null) {
        if (queryString != "?") queryString += "&";
        queryString += "sede=" + parametros.sede;
      }
      if (parametros.jornada != null) {
        if (queryString != "?") queryString += "&";
        queryString += "jornada=" + parametros.jornada
      }
      if (parametros.tipo_personal != null) {
        if (queryString != "?") queryString += "&";
        queryString += "tipoPersonal=" + parametros.tipo_personal
      }
      if (parametros.numero_identificacion != null) {
        if (queryString != "?") queryString += "&";
        queryString += "identifacion=" + parametros.numero_identificacion
      }
      if (parametros.primer_nombre != null) {
        if (queryString != "?") queryString += "&";
        queryString += "primerNombre=" + parametros.primer_nombre
      }
      if (parametros.segundo_nombre != null) {
        if (queryString != "?") queryString += "&";
        queryString += "segundoNombre=" + parametros.segundo_nombre
      }
      if (parametros.primer_apeliido != null) {
        if (queryString != "?") queryString += "&";
        queryString += "primerApellido=" + parametros.primer_apeliido
      }
      if (parametros.segundo_apeliido != null) {
        if (queryString != "?") queryString += "&";
        queryString += "segundoApellido=" + parametros.segundo_apeliido
      }
      if (parametros.institucion != null) {
        if (queryString != "?") queryString += "&";
        queryString += "institucion=" + parametros.institucion
      }
      if (parametros.identificacion != null) {
        if (queryString != "?") queryString += "&";
        //Todo corregir palabra
        queryString += "identifacion=" + parametros.identificacion
      }
    }
    this.setearCabeceras();
    const url = `${environment.URL_API_PERSONAL}/personal/simple${queryString}`;
    return this.http.get(url, this.httpOptions)
  }

  actualizarEmail(parametros: any) {
    this.setearCabeceras();
    //console.log("Estas son las cabeceras: ", this.httpOptions);
    const url = `${environment.URL_API_PERSONAL}/personal/update/email/?identificacion=${parametros.identificacion}&email=${parametros.email}`;
    return this.http.put(url, {}, {
      ...this.httpOptions,
      observe: 'response'
    });
  }

  actualizarFoto(parametros: any, formData: any) {
    let http_options = {
      headers: new HttpHeaders({
        "Authorization": (this.tokenService.getToken().token) ? `Bearer ${this.tokenService.getToken().token}` : ''
      })
    };
    const url = `${environment.URL_API_PERSONAL}/personal/photo/save/${parametros.es_fotografia}/${parametros.indentificacion}`;
    return this.http.post(url, formData,
      {
        ...http_options,
        observe: 'response'
      });
  }

  obtenerPerfilUsuario(parametros: any) {
    this.setearCabeceras();
    const url = `${environment.URL_API_PERSONAL}/personal/profiles/personal/${parametros.institucion}/${parametros.identificacion}`;
    return this.http.get(url, this.httpOptions);
  }


  guardarPerfil(perfiles: any) {
    this.setearCabeceras();
    const url = `${environment.URL_API_PERSONAL}/personal/guardar/perfil`;
    return this.http.post(url, perfiles, this.httpOptions);
  }

  eliminarPerfil(parametros: any) {
    this.setearCabeceras();
    const url = `${environment.URL_API_PERSONAL}/personal/eliminar/perfil/${parametros.codigo_jerarquico}/${parametros.identificacion}`;
    return this.http.delete(url, this.httpOptions);
  }


  desasociarFuncionario(parametros: any) {
    this.setearCabeceras();
    const url = `${environment.URL_API_PERSONAL}/personal/desasociar/funcionario/${parametros.institucion}/${parametros.identificacion}`;
    return this.http.delete(url, this.httpOptions);
  }

  InactivarFuncionario(parametros: any) {
    this.setearCabeceras();
    const url = `${environment.URL_API_PERSONAL}/personal/estado/perfil/${parametros.institucion}/${parametros.identificacion}/${parametros.estado}`;
    return this.http.post(url, parametros, this.httpOptions);
  }

  actualizarPerfil(parametros: any) {
    this.setearCabeceras();
    const url = `${environment.URL_API_PERSONAL}/personal/actualizar/perfil`;
    return this.http.post(url, parametros, this.httpOptions)
  }

  exportReporteInstitucion(parametros: any){
    this.setearCabeceras();
  
    const url = this.buildReportUrlInstitucion(parametros);

    return this.http.get(url, {
      ...this.httpOptions,
      observe: 'response',
      responseType: 'blob',
    });
  }

  private buildReportUrlInstitucion(params: any): string {
    const { institucion, sede, jornada, metodologia, vigencia } = params;
    return `${environment.URL_API_PERSONAL}/personal/reporte/exportall/${institucion}/${sede}/${jornada}/${metodologia}/${vigencia}`;
  }


  exportReporte(parametros: any,body:any){
    
    const url = this.buildReportUrl(parametros);

    this.setearCabeceras();
    return this.http.post(url, body,  {
      ...this.httpOptions,
      observe: 'response',
      responseType: 'blob',
    });
  }

  private buildReportUrl(params: any): string {
    const { institucion, sede, jornada, metodologia, vigencia } = params;
    return `${environment.URL_API_PERSONAL}/personal/reporte/export/${institucion}/${sede}/${jornada}/${metodologia}/${vigencia}`;
  }

}
