import { Component, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mensaje-error-component',
  templateUrl: './mensaje-error-component.component.html',
  styleUrls: ['./mensaje-error-component.component.scss']
})
export class MensajeErrorComponentComponent implements OnDestroy {

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
