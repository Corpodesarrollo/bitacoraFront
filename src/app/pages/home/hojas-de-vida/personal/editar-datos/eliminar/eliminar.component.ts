import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.scss']
})
export class EliminarComponent {

  eliminandoPerfil:boolean = false;

  /**Servico */
  activeModal = inject(NgbActiveModal)

  /**Metodo para cerrar la vista dle modal */
  cerrar(valor:boolean){
    this.activeModal.close(valor)
  }

}
