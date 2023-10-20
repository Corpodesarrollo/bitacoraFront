import { Component, inject} from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-cambioC',
  templateUrl: './error-cambio.component.html',
  styleUrls: ['./error-cambio.component.scss']
})
export class ErrorCambioComponentC {
  ngModal = inject(NgbActiveModal);
  esMicrosoft: boolean = false;
  usuarioNoEncontrado: boolean = false;
  cambioExitoso: boolean = false;

  constructor() { };

  cancelar(){
    this.ngModal.close()
  }
}
