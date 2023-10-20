import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cerrar',
  templateUrl: './cerrar.component.html',
  styleUrls: ['./cerrar.component.scss']
})
export class CerrarComponent {

  activeModal = inject(NgbActiveModal)

  salir(){
    this.activeModal.close(true)
  }

  continuar(){
    this.activeModal.close(false)
  }
}
