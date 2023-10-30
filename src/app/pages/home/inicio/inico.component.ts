import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inico',
  templateUrl: './inico.component.html',
  styleUrls: ['./inico.component.scss']
})
export class InicioComponent {

  idInstitucion: number;
  idSede: number;
  idJornada: number;
  localidadId: number=0;
  cargandoPermisos: boolean = false;

  parametrosFiltros: any = {
    "bandera": "0",
    "perfilId": ""
  }

  primerosMensajes: any[] = [];
  mensajeCargando: string = '';
  cantidadMensajes: number = 0;
  usuarioLogueado: any;

  puedeVerMensajes: boolean
  puedeVerColegios: boolean
  puedeVerEstudiantes: boolean

  esIframe:boolean = false;
  cargandoIframe:boolean = false;
  urlIframe:any
  mensaje:string


  constructor(
    private usuarioService: UsuarioService,
    private mensajesService: MensajesService,
    private router: Router,
    private sanitizer: DomSanitizer,
    ) {

    this.usuarioLogueado = this.usuarioService.obtenerUsuario();
    let datosUsuario: AccesoPerfil = this.usuarioService.obtenerAccesoSeleccionado();
    this.parametrosFiltros.perfilId = datosUsuario.perfil.id;
    if (datosUsuario.colegio) {
      this.idInstitucion = datosUsuario.colegio.id
      this.idSede = datosUsuario.sede.id
      this.idJornada = datosUsuario.jornada.id
    }
    if(datosUsuario.localidad){
      this.localidadId = datosUsuario.localidad.id
    }
    this.cargandoPermisos = true
    this.cargarPermisos();
  }


  ngOnInit() {
    this.cargarListas();
  }

  cargarPermisos() {
    this.usuarioService.permisosActualizados$.subscribe((permisosActualizados) => {
      if (permisosActualizados) {
        this.puedeVerMensajes = this.usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.VER_MENSAJE),
          this.puedeVerColegios = this.usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.HOME_LISTA_COLEGIOS),
          this.puedeVerEstudiantes = this.usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.HOME_LISTA_ESTUDIANTES)
        this.cargandoPermisos = false;
      }
    });
  }

  cargarListas() {
    let datosUsuario: AccesoPerfil = this.usuarioService.obtenerAccesoSeleccionado();
    this.parametrosFiltros.usuarioId = this.usuarioLogueado.id;
    this.parametrosFiltros.localidadId = datosUsuario.localidad?.id;
    this.parametrosFiltros.colegioId = datosUsuario.colegio?.id;
    this.parametrosFiltros.perfilId = datosUsuario.perfil.id;
    this.parametrosFiltros.perfilLoginId = datosUsuario.perfil.id;
    this.parametrosFiltros.jornadaId = datosUsuario.jornada?.id;
    this.parametrosFiltros.sedeId = datosUsuario.sede?.id;

    this.mensajesService.obtenerMensajes(this.parametrosFiltros).subscribe((resp: any) => {
      if (resp.data) {
        this.primerosMensajes = resp.data;
        this.cantidadMensajes = resp.data.length;
      }
    })
  }

  verMensajes() {
    this.router.navigateByUrl("/home/mensajes");
  };

}




