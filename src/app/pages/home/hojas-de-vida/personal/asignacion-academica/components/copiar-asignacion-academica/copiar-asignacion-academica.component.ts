import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-copiar-asignacion-academica',
  templateUrl: './copiar-asignacion-academica.component.html',
  styleUrls: ['./copiar-asignacion-academica.component.scss']
})
export class CopiarAsignacionAcademicaComponent {

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
