import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DatosFiltrados } from 'src/app/classes/datos_filtrados.interface';
import { DatosBitacora } from 'src/app/classes/datos_bitacora.interface';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  httpOptions = {};
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  setearCabeceras() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': `${environment.CONTENT_TYPE}; charset=UTF-8`,
        "Authorization": (this.tokenService.getToken().token) ? `Bearer ${this.tokenService.getToken().token}` : ''
      })
    };
  }


  obtenerEstudiante(parametros:any){
    this.setearCabeceras()
    return this.http.get(`${environment.URL_API}/apoyo/consultas/estudiantes/${parametros.tipoDocumento}/${parametros.numeroDocumento}/${parametros.codigoEstudiante}`,this.httpOptions);
  }
  generarBoletin(id: number){
    this.setearCabeceras()
    return this.http.get(`${environment.URL_API}/apoyo/estudiantes/${id}/boletines/generar}`,this.httpOptions);
  }

  validarPin(pin: number){
    const url = `${environment.URL_API}/apoyo/consultas/estudiantes/${pin}`
    const headers = new HttpHeaders({
      'Content-Type': 'application/zip',
      "Authorization": (this.tokenService.getToken().token) ? `Bearer ${this.tokenService.getToken().token}` : ''
    });
    return this.http.get(url,  { responseType: 'blob', headers: headers, observe: 'response' });
  }

  generarCertificado(id:number){
    this.setearCabeceras()
    return this.http.get(`${environment.URL_API}/apoyo/estudiantes/${id}/certificado/generar`,this.httpOptions)
  }

  generarBoletinEstudiante(dto: any):Observable<Blob> {   
    const apiUrl = `${environment.URL_API_REPORTE}/generate/reportOnFly`;
    const headers = new HttpHeaders({
      'Content-Type': `${environment.CONTENT_TYPE}; charset=UTF-8`,
      "Authorization": (this.tokenService.getToken().token) ? `Bearer ${this.tokenService.getToken().token}` : ''
    });
    return this.http.post<any>(apiUrl, dto, {
      headers: headers,
      responseType: 'blob' as 'json'
    });
  }

  obtenerTiposDocumento(){
    this.setearCabeceras()
    const url = `${environment.URL_API}/apoyo/consultas/estudiantes/listaDocumentosIdentidad`
    return this.http.get(url,this.httpOptions)
  }

  consultaBitacoras(filtros: DatosFiltrados):Observable<DatosBitacora[]> {
    this.setearCabeceras()
    const url = `${environment.URL_BITACORAS}/apoyo/consultas/Bitacora`
    return this.http.post<DatosBitacora[]>(url, filtros, this.httpOptions);
  }

  exportarBitacoraPDF(id?: number):Observable<any> {
    this.setearCabeceras()
    let url = `${environment.URL_BITACORAS}/apoyo/bitacora/exportarAPdf`
    if(id)
      url = `${url}?id=${id}`;
    return this.http.get<any>(url,this.httpOptions);
  }

  exportarBitacoraExcel(id?: number):Observable<any> {
    this.setearCabeceras();
    let url = `${environment.URL_BITACORAS}/apoyo/bitacora/exportarAExcel`
    if(id)
      url = `${url}?id=${id}`;
    return this.http.get<any>(url,this.httpOptions);
  }

}
