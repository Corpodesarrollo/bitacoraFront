import { Component, inject } from '@angular/core';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent {

  rolUsuario:any;
  mostrarFiltros!:boolean;
  noEsPerfil!:boolean;
  serviciosUsuario = inject(UsuarioService)


  ngOnInit() {
    this.rolUsuario = this.serviciosUsuario.obtenerRolUsuario();
    if(this.rolUsuario === 'rector' || this.rolUsuario ==='coordinador'){
      this.mostrarFiltros = true
    }
    else if(this.rolUsuario === 'docente' ){
      this.mostrarFiltros = false;
    }
    else{
      this.noEsPerfil = true;
      this.mostrarFiltros = false;
    }
  }
}
