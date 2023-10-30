import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccesosRapdios } from 'src/app/interfaces/accesos_rapidos.interface';
import { InicioService } from 'src/app/services/api/inicio/inicio.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-accesos-directos',
  templateUrl: './accesos-directos.component.html',
  styleUrls: ['./accesos-directos.component.scss']
})
export class AccesosDirectosComponent {


  accesosRapidos:AccesosRapdios[]=[];
  perfilUsuario:number;
  noTieneAccesos:boolean = true;


  constructor(
    private usuariosServices: UsuarioService,
    private inicioServices: InicioService,
    private router: Router
  ){
    this.perfilUsuario = this.usuariosServices.obtenerUsuarioPerCol().perfil.id;
    this.cargarListas(this.perfilUsuario)
  }

  cargarListas(perfil_id:number){
    this.inicioServices.obtenerAccesosRapidos(perfil_id).subscribe({
      next: (respuesta:any) => {
        if(respuesta && respuesta.code == 200){
          this.accesosRapidos = respuesta.data
          this.noTieneAccesos = false;
        }
        else{
          this.noTieneAccesos = true
        }
      },
      error: (error) => console.log(error)
    })
  }

  abrirOpcion(ruta:string){
    console.log(ruta);
    this.router.navigate(['/home/ver', ruta])
  }

}
