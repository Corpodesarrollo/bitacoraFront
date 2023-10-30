import { Component, Input, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsignacionAcademicaService } from 'src/app/services/api/personal/asignacion-academica.service';

@Component({
  selector: 'app-mensaje-descargar-reporte',
  templateUrl: './mensaje-descargar-reporte.component.html',
  styleUrls: ['./mensaje-descargar-reporte.component.scss']
})
export class MensajeDescargarReporteComponent {

  @Input() infoMensaje:any;
  
  asignacionAcademicaService = inject(AsignacionAcademicaService);
  servicioModal = inject(NgbModal);

  // @Input() mensaje:string = "";

  ngOnDestroy(): void {
    this.infoMensaje;
  }

  cerrarModal(){
    this.servicioModal.dismissAll()
  }

  exportarInstitucionPdf(){
    
  }

  exportarPdf(){

  }

}
