import { Component, Inject, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-confirmar-cerrar-sesion',
  templateUrl: './confirmar-cerrar-sesion.component.html',
  styleUrls: ['./confirmar-cerrar-sesion.component.scss']
})
export class ConfirmarCerrarSesionComponent {

  activeModal = inject(NgbActiveModal)
  usuarioService = inject(UsuarioService)

  cerrar(){
    this.activeModal.close()
  }

  cerrarSesion(){
    this.usuarioService.cerrarSesion(false);
    this.activeModal.close(false)
  }

}
