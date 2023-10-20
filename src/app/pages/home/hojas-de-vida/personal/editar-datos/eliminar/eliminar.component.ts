import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.scss']
})
export class EliminarComponent {

  eliminandoPerfil:boolean = false;

  constructor(
    private activeModal: NgbActiveModal
  ){
  }

  cerrar(valor:boolean){
    this.activeModal.close(valor)
  }

}
