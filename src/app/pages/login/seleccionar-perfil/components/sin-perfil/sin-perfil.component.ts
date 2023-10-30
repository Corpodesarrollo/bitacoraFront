import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sin-perfil',
  templateUrl: './sin-perfil.component.html',
  styleUrls: []
})
export class SinPerfilComponent {

  @Output() cerrar_sesion = new EventEmitter<any>();

  cerrarSesion(){
    this.cerrar_sesion.emit()
  }
}
