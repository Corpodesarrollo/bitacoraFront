import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss']
})

export class MensajesComponent {

  parametrosFiltros:any = {
    "bandera":"1",
    "perfilId":"",
    "usuarioId":"",
    "colegioId":"",
    "jornadaId":"",
    "sedeId":"",
    "localidadId":""
  }

  mensajes:any[] = [];
  listadoMensajes: any[] = [];

  usuarioLogueado: any;
  conMensajesCargados: boolean = true;
  fechaActual: string;
  mensajeResp: any;
  puedeEnviarMensajes:boolean = false;
  puedeVerMensaje:boolean = false;


  constructor(private mensajesService: MensajesService,
              private router: Router,
              private serviciosUsuario : UsuarioService,
              ){


    let datosUsuario:AccesoPerfil  = this.serviciosUsuario.obtenerAccesoSeleccionado();
    this.usuarioLogueado = this.serviciosUsuario.obtenerUsuario();
    this.puedeEnviarMensajes = this.serviciosUsuario.obtetenerPermisosPerfil(PermisosUsuarios.ENVIAR_MENSAJES)
    this.puedeVerMensaje = this.serviciosUsuario.obtetenerPermisosPerfil(PermisosUsuarios.VER_MENSAJE)
    if(this.parametroCargado(datosUsuario.perfil.id)) this.parametrosFiltros.perfilId =  datosUsuario.perfil.id;
    if(this.parametroCargado(this.usuarioLogueado.id)) this.parametrosFiltros.usuarioId = this.usuarioLogueado.id;
    if(this.parametroCargado(datosUsuario.colegio)) this.parametrosFiltros.colegioId = datosUsuario.colegio.id;
    if(this.parametroCargado(datosUsuario.jornada)) this.parametrosFiltros.jornadaId = datosUsuario.jornada.id;
    if(this.parametroCargado(datosUsuario.sede)) this.parametrosFiltros.sedeId = datosUsuario.sede.id;
    if(this.parametroCargado(datosUsuario.localidad)) this.parametrosFiltros.localidadId = datosUsuario.localidad.id;
    if(this.parametroCargado(datosUsuario.perfil.id)) this.parametrosFiltros.perfilLoginId = datosUsuario.perfil.id;

    this.mensajesService.obtenerMensajes(this.parametrosFiltros).subscribe((resp:any)=>{
      //console.log(resp)
      this.listadoMensajes = resp.data;
      if(resp.data == null){
        this.conMensajesCargados = true;
        this.mensajeResp = false;
      }else{
        this.conMensajesCargados = false;
        this.mensajeResp = true;
      }
      this.conMensajesCargados = false;
    });

    //console.log(this.usuarioLogueado);


    const date = new Date();
                // Iniciar en este año, este mes, en el día 1
                this.fechaActual = this.formatearFecha(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1));
                let fechaArray = this.fechaActual.split('-');
                this.fechaActual = `${fechaArray[0]}-${fechaArray[2]}-${fechaArray[1]}`
                //console.log(this.fechaActual)
  }

  parametroCargado(parametro){
      let bool:Boolean;
      if(parametro == null) { bool = false } else { bool = true }
      return bool;
  }

  formatearFecha(fecha) {
    // year: 2023, month: 4, day: 1
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    return `${fecha.getFullYear()}-${(dia < 10 ? '0' : '').concat(dia)}-${(mes < 10 ? '0' : '').concat(mes)}`;
  };

  verMensaje(id:string){
    this.router.navigate([`./home/mensajes/ver/${id}`]);
  }


  ngOnInit(): void {
  }



}
