import { Component, inject, OnInit} from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { MsalService } from '@azure/msal-angular';


@Component({
  selector: 'app-exito-cambioC',
  templateUrl: './exito-cambio.component.html',
  styleUrls: ['./exito-cambio.component.scss']
})
export class ExitoCambioComponentC implements OnInit{
  ngModal = inject(NgbActiveModal);
  esMicrosoft: boolean = false;
  usuarioNoEncontrado: boolean = false;
  cambioExitoso: boolean = false;

  constructor(
    private authService: MsalService,
    private usuarioService: UsuarioService,
    ) { };

  ngOnInit(): void {
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
  }

  cerrar(){
    this.cambioExitoso = true;
    setTimeout(() => {
      this.ngModal.close()
      this.cerrarSesion()
    }, 2000);
  }

  cerrarSesion() {
    this.usuarioService.borrarSeleccionColegio();
    this.usuarioService.cerrarSesion(this.esMicrosoft)
  };
}
