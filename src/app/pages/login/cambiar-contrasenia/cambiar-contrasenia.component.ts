import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-cambiar-contraseniaL',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.scss']
})
export class CambiarContraseniaComponentLogin  {
  usuario: any;

    constructor(private router: Router,
      private usuarioService: UsuarioService) {
        this.usuario = this.usuarioService.obtenerUsuario();
        if (this.usuario.cambiar_contrasenia === false) {
          this.router.navigate(['/home']);
        }
      }
}
