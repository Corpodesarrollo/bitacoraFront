import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  constructor(
    private http: HttpClient,
  ) { }


  obtenerEstudiante(parametros:any){
    return this.http.get(`${environment.URL_API}/apoyo/consultas/estudiantes/${parametros.tipoDocumento}/${parametros.numeroDocumento}/${parametros.codigoEstudiante}`);
  }
  generarBoletin(id: number){
    return this.http.get(`${environment.URL_API}/apoyo/estudiantes/${id}/boletines/generar}`);
  }

  validarPin(pin: number){
    const url = `${environment.URL_API}/apoyo/consultas/estudiantes/${pin}`
    const headers = new HttpHeaders({
      'Content-Type': 'application/zip',
    });
    return this.http.get(url,  { responseType: 'blob', headers: headers, observe: 'response' });
  }

  generarCertificado(id:number){
    return this.http.get(`${environment.URL_API}/apoyo/estudiantes/${id}/certificado/generar`)
  }

  generarBoletinEstudiante(dto: any):Observable<Blob> {   
    const apiUrl = `${environment.URL_API_REPORTE}/generate/reportOnFly`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(apiUrl, dto, {
      headers: headers,
      responseType: 'blob' as 'json'
    });
  }

  obtenerTiposDocumento(){
    const url = `${environment.URL_API}/apoyo/consultas/estudiantes/listaDocumentosIdentidad`
    return this.http.get(url)
  }

}
