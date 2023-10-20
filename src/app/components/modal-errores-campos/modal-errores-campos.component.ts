import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-errores-campos',
  templateUrl: './modal-errores-campos.component.html',
  styleUrls: ['./modal-errores-campos.component.scss']
})
export class ModalErroresCamposComponent {

  titulo:string = ''
  lista_errores:any
  candidatoNoEncontrado:boolean = false;
  mensajeError:string = "Lo siento, no se pudo enviar el formulario debido a errores en los campos listados a continuación:";
  ngModal = inject(NgbModal);

  cerrar(){
    this.candidatoNoEncontrado = false;
    this.ngModal.dismissAll()
  }
}
