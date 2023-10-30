import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent {

  perfilUsuario:any;
  rolDiferente!:boolean;
  noEsPerfil!:boolean;
  serviciosUsuario = inject(UsuarioService)
  router = inject(Router)
  permisosEditar:boolean = false;
  permisosListar:boolean = false;

  //Todo Ajustar esto al router
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
