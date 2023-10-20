import { Component, Inject, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-confirmar-cerrar-sesion',
  templateUrl: './confirmar-cerrar-sesion.component.html',
  styleUrls: ['./confirmar-cerrar-sesion.component.scss']
})
export class ConfirmarCerrarSesionComponent {

  servicioModal = inject(NgbModal)
  usuarioService = inject(UsuarioService)

  cerrar(){
    this.servicioModal.dismissAll()
  }

  cerrarSesion(){
    this.usuarioService.cerrarSesion(false);
    this.servicioModal.dismissAll()
  }

}
