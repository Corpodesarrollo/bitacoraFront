import { HttpResponse } from '@angular/common/http';
import { Component, Input, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsignacionAcademicaService } from 'src/app/services/api/personal/asignacion-academica.service';
import { PersonalService } from 'src/app/services/api/personal/personal.service';

@Component({
  selector: 'app-mensaje-descargar-reporte',
  templateUrl: './mensaje-descargar-reporte.component.html',
  styleUrls: ['./mensaje-descargar-reporte.component.scss']
})
export class MensajeDescargarReporteComponent {

  @Input() infoMensaje: any;

  personalService = inject(PersonalService);
  servicioModal = inject(NgbModal);
  exportandoRegistros: boolean = false;

  // @Input() mensaje:string = "";

  ngOnInit(){
    
  }

  ngOnDestroy(): void {
    this.infoMensaje;
  }

  cerrarModal() {
    this.servicioModal.dismissAll()
  }

  exportarInstitucionPdf() {

    this.exportandoRegistros = true;

    let parametros: any = {
      institucion: this.infoMensaje.parametros.institucion,
      jornada: this.infoMensaje.parametros.id_jornada,
      sede: this.infoMensaje.parametros.id_sede,
      vigencia: this.infoMensaje.parametros.id_vigencia,
      metodologia: this.infoMensaje.parametros.id_metodologia
    }

    this.personalService.exportReporteInstitucion(parametros).subscribe((response: HttpResponse<Blob>) => {
      console.log(response)
      // Extraer la información necesaria de la respuesta
      if(response.status == 200){
        this.exportandoRegistros = false;
        const blob = response.body;
        const filename = this.extractFilename(response);
  
        // Crear una URL para el blob
        const blobUrl = window.URL.createObjectURL(blob);
  
        // Crear un enlace (<a>) para iniciar la descarga
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
  
        // Simular un clic en el enlace para iniciar la descarga
        a.click();
  
        
  
        // Liberar los recursos de la URL del blob
        window.URL.revokeObjectURL(blobUrl);
      }
    },
      error => {
        this.exportandoRegistros = false;
        console.error('Error al descargar el archivo', error);
      })

  }


  exportarPdf() {

    this.exportandoRegistros = true;

    let parametros: any = {
      institucion: this.infoMensaje.parametros.institucion,
      jornada: this.infoMensaje.parametros.id_jornada,
      sede: this.infoMensaje.parametros.id_sede,
      vigencia: this.infoMensaje.parametros.id_vigencia,
      metodologia: this.infoMensaje.parametros.id_metodologia
    }

    
    let body =  []
    
    this.infoMensaje.funcionarios.forEach((funcionario)=>{
      body.push({"identificacion": funcionario.identifacion})
      // console.log(body)
    })

    this.personalService.exportReporte(parametros,body).subscribe((response: HttpResponse<Blob>) => {
      //console.log(response)
      // Extraer la información necesaria de la respuesta
      this.exportandoRegistros = false;
      const blob = response.body;
      const filename = this.extractFilename(response);

      // Crear una URL para el blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Crear un enlace (<a>) para iniciar la descarga
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;

      // Simular un clic en el enlace para iniciar la descarga
      a.click();

      // Liberar los recursos de la URL del blob
      window.URL.revokeObjectURL(blobUrl);
    },
      error => {
        console.error('Error al descargar el archivo', error);
      })
  }

  private extractFilename(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch.length === 2) {
        return filenameMatch[1];
      }
    }
    return 'archivo_descarga.pdf';
  }


}
