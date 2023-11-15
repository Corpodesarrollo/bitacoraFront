import { HttpResponse } from '@angular/common/http';
import { Component, Input, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { saveAs } from 'file-saver'

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
  exportandoRegistrosExcel: boolean = false;
  // @Input() mensaje:string = "";

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.infoMensaje;
  }

  cerrarModal() {
    this.servicioModal.dismissAll()
  }

  exportarInstitucion(tipo_exportacion: any) {


    let parametros: any = {
      institucion: this.infoMensaje.parametros.institucion,
      jornada: this.infoMensaje.parametros.id_jornada,
      sede: this.infoMensaje.parametros.id_sede,
      vigencia: this.infoMensaje.parametros.id_vigencia,
      metodologia: this.infoMensaje.parametros.id_metodologia
    }

    if (tipo_exportacion == 'pdf') {
      this.exportandoRegistros = true;
      this.personalService.exportReporteInstitucion(parametros).subscribe((response: any) => {
        console.log(response)
        // Extraer la información necesaria de la respuesta
        if (response.status == 200) {
          this.exportandoRegistros = false;

          let salida = "data:application/octet-stream;base64," + response.data
          saveAs(salida, "reporte" + ".pdf")

        }
      },
        error => {
          this.exportandoRegistros = false;
          console.error('Error al descargar el archivo', error);
        })
    } else if (tipo_exportacion == 'excel') {
      this.exportandoRegistrosExcel = true;
      this.personalService.exportReporteInstitucionExcel(parametros).subscribe((response: any) => {
        // Extraer la información necesaria de la respuesta
        // console.log(response)
        if (response.status == 200) {
          this.exportandoRegistrosExcel = false;

          let salida = "data:application/octet-stream;base64," + response.data
          saveAs(salida, "reporte" + ".xls")
        }
      },
        error => {
          this.exportandoRegistrosExcel = false;
          console.error('Error al descargar el archivo', error);
        })
    }

  }


  exportar(tipo_exportacion: any) {


    let parametros: any = {
      institucion: this.infoMensaje.parametros.institucion,
      jornada: this.infoMensaje.parametros.id_jornada,
      sede: this.infoMensaje.parametros.id_sede,
      vigencia: this.infoMensaje.parametros.id_vigencia,
      metodologia: this.infoMensaje.parametros.id_metodologia
    }


    let body = []

    this.infoMensaje.funcionarios.forEach((funcionario) => {
      body.push({ "identificacion": funcionario.identifacion })
      // console.log(body)
    })

    if (tipo_exportacion == 'pdf') {
      this.exportandoRegistros = true;
      this.personalService.exportReporte(parametros, body).subscribe((response: any) => {
        //console.log(response)
        // Extraer la información necesaria de la respuesta
        this.exportandoRegistros = false;
        let salida = "data:application/octet-stream;base64," + response.data
          saveAs(salida, "reporte" + ".pdf")
      },
        error => {
          console.error('Error al descargar el archivo', error);
        })
    } else if (tipo_exportacion == 'excel') {
      this.exportandoRegistrosExcel = true;
      this.personalService.exportReporteExcel(parametros, body).subscribe((response: any) => {
        //console.log(response)
        // Extraer la información necesaria de la respuesta
        console.log(response)
        if (response.status == 200) {
          this.exportandoRegistrosExcel = false;

          let salida = "data:application/octet-stream;base64," + response.data
          saveAs(salida, "reporte" + ".xls")
        }
      },
        error => {
          console.error('Error al descargar el archivo', error);
        })
    }
  }

  private extractFilename(response: HttpResponse<Blob>, tipo_exportacion): string {
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch.length === 2) {
        return filenameMatch[1];
      }
    }
    if (tipo_exportacion == "excel") {
      return 'archivo_descarga.xls';
    }
    return 'archivo_descarga.pdf';
  }

}