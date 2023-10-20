import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-informacion',
  templateUrl: './modal-informacion.component.html',
  styleUrls: ['./modal-informacion.component.scss']
})
export class ModalInformacionComponent {

  /**
   * JSON que configura la informacion a mostra en el modal
   * done = Icono de exito
   * error = Icono de error
   */
  informacion = {
    error: false,
    esExitoso: '',
    titulo: '',
    mensaje: ''
  }

  activeModal = inject(NgbActiveModal)

  cerrar(){
    this.activeModal.close()
  }
}
