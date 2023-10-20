import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mensaje-descargar-reporte',
  templateUrl: './mensaje-descargar-reporte.component.html',
  styleUrls: ['./mensaje-descargar-reporte.component.scss']
})
export class MensajeDescargarReporteComponent {

  
  @Input() infoMensaje:any;
  // @Input() mensaje:string = "";


  constructor(private servicioModal : NgbModal){
    
  }

  ngOnDestroy(): void {
    this.infoMensaje;
  }

  cerrarModal(){
    this.servicioModal.dismissAll()
  }

}
