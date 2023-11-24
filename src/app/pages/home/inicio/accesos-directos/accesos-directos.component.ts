import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccesosRapdios } from 'src/app/interfaces/accesos_rapidos.interface';
import { InicioService } from 'src/app/services/api/inicio/inicio.service';
import { OpcionesMenuService } from 'src/app/services/api/opciones-menu/opciones-menu.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { environment } from 'src/environments/environment';

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
    private opcionesService: OpcionesMenuService,
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

  async abrirOpcion(ruta:string){
    let recursoUrl = await this.opcionesService.obtenerRecurso(ruta);
    console.log("recursoUrl ==> ", recursoUrl);
    this.router.navigate(['/home/ver', environment.URL_APOYO_ESCOLAR +  recursoUrl])
  }

}
