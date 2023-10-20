import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss']
})
export class MensajesComponent implements OnInit{

  parametrosFiltros:any = {
    "bandera":"0",
    "perfilId":""
  }

  primerosMensajes: any[] = [];

  usuarioLogueado: any;
  fechaActual: any;
  cargandoMensajes: boolean;
  conMensajesCargados: boolean;

  constructor(private mensajesService: MensajesService,
              private usuarioService: UsuarioService,
              private router: Router) {
                this.usuarioLogueado = this.usuarioService.obtenerUsuario();


                const date = new Date();
                // Iniciar en este año, este mes, en el día 1
                this.fechaActual = this.formatearFecha(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1));
                let fechaArray = this.fechaActual.split('-');
                this.fechaActual = `${fechaArray[0]}-${fechaArray[2]}-${fechaArray[1]}`
                //console.log(this.fechaActual)
              }


  ngOnInit() {
    this.parametrosFiltros.usuarioId = this.usuarioLogueado.id;

    let datosUsuario  = JSON.parse(sessionStorage.getItem('sap_sec_percol')!)
    this.parametrosFiltros.localidadId = datosUsuario.localidad.idLocalidad;
    this.parametrosFiltros.colegioId = datosUsuario.colegio.idColegio;
    this.parametrosFiltros.perfilId = datosUsuario.perfil.idPerfil;
    this.parametrosFiltros.perfilLoginId = datosUsuario.perfil.idPerfil;
    this.parametrosFiltros.jornadaId = datosUsuario.jornada.idJornada;
    this.parametrosFiltros.sedeId = datosUsuario.sede.idSede;
    this.cargandoMensajes = true;
    this.obtenerMensajes();
  }

  obtenerMensajes(){
    this.mensajesService.obtenerMensajes(this.parametrosFiltros).subscribe((resp:any)=>{
      if(resp.data){
        this.primerosMensajes = resp.data.slice(0,3);
        this.conMensajesCargados = true;
        this.cargandoMensajes = false;
      }
    })
  }

  formatearFecha(fecha) {
    // year: 2023, month: 4, day: 1
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    return `${fecha.getFullYear()}-${(dia < 10 ? '0' : '').concat(dia)}-${(mes < 10 ? '0' : '').concat(mes)}`;
  };

  verMensaje(id:any){
    this.router.navigate([`home/mensajes/ver/${id}`])
  }
}
