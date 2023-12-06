import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cerrar',
  templateUrl: './cerrar.component.html',
  styleUrls: ['./cerrar.component.scss']
})
export class CerrarComponent {

  /**
   * Servicio de Modal
   */
  activeModal = inject(NgbActiveModal)

  /**
   * Meotdo para salir
   */
  salir(){
    this.activeModal.close(true)
  }

  /**
   * Metodo para continuar en la vista
   */
  continuar(){
    this.activeModal.close(false)
  }
}
