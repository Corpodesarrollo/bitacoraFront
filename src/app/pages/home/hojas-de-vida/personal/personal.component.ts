import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent {


  /**
   * Variables globales
   */
  perfilUsuario:any;

  /**
   * Servicios
   */
  serviciosUsuario = inject(UsuarioService)
  router = inject(Router)


  /**
   * Metodo que valida el perfil del usuario
   * Si es rector o cordinar enruta hacia persona,
   * Si no enruta hacia la vista de editar-funcionariso
   */
  ngOnInit() {
    this.perfilUsuario = this.serviciosUsuario.obtenerPerfilUsuario().nombre;
    if(this.perfilUsuario === 'rector' || this.perfilUsuario ==='coordinador'){
      this.router.navigate(['home/hojas-de-vida/personal'])
    }
    else{
      this.router.navigate(['home/hojas-de-vida/personal/editar-datos-funcionario'])
    }
  }

}
