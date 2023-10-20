import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  titulo:string = ''
  lista_errores:any
  candidatoNoEncontrado:boolean = false;
  ngModal = inject(NgbModal);

  cerrar(){
    this.candidatoNoEncontrado = false;
    this.ngModal.dismissAll()
  }
}
