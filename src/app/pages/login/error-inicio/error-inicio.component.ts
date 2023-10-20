import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-inicio',
  templateUrl: './error-inicio.component.html',
  styleUrls: ['./error-inicio.component.scss']
})
export class ErrorInicioComponent {

  ngModal = inject(NgbActiveModal);

  usuarioNoEncontrado = false;

  cerrar(){
    this.ngModal.close()
  }
}
