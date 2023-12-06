import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { MensajeModal } from '../mensaje-modal/mensaje-modal';
import { UtilsService } from 'src/app/services/generales/utils/utils.service';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})
export class BuscarComponent {

  fechaActual: any;
  confimarEliminar: any;
  totalRegistros: any;

  totalResultados!: number;
  pagina: number = 0;
  pageSize: number = 10;
  totalPaginas: number;

  cargandoMensajes: boolean = false;
  mensajeSinDatosCargados: boolean = false;
  mensajesCargados: boolean = false;

  permisosUsuario = {
    editar: false,
    ver: false,
    eliminar: false,
    puedeEnviarMensajes: false
  }

  mensajes: any[] = [];

  usuarioLogueado: any;

  parametrosPagina = {}

  parametrosFiltros: any = {
    bandera: "2",
    perfilId: "",
    colegio_id: "",
    localidad_id: "",
    usuarioId: "",
    pagina: this.pagina,
    size: this.pageSize,
    sort: 'primerNombre,asc'
  }
  sinMensajesBuscar: boolean;


  constructor(private mensajesService: MensajesService,
    private usuarioService: UsuarioService,
    private router: Router,
    private servicioModal: NgbModal,
    private utilsService: UtilsService) {

    //this.cargarMensajes();
    this.usuarioLogueado = this.usuarioService.obtenerUsuario();
    this.permisosUsuario = {
      editar: this.usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.EDITAR_MENSAJE),
      ver: this.usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.VER_MENSAJE),
      eliminar: this.usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.ELIMINAR_MENSAJE),
      puedeEnviarMensajes: this.usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.ENVIAR_MENSAJES)
    }

    const date = new Date();
    // Iniciar en este año, este mes, en el día 1
    this.fechaActual = this.formatearFecha(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1));
    let fechaArray = this.fechaActual.split('-');
    this.fechaActual = `${fechaArray[0]}-${fechaArray[2]}-${fechaArray[1]}`
    //console.log(this.fechaActual)

    this.utilsService.mensajeBorrado.subscribe((resp: any) => {
      //console.log(resp)
      this.confimarEliminar = resp;
    })

  }


  formatearFecha(fecha) {
    // year: 2023, month: 4, day: 1
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
    return `${fecha.getFullYear()}-${(dia < 10 ? '0' : '').concat(dia)}-${(mes < 10 ? '0' : '').concat(mes)}`;
  };

  cargarMensajes(parametrosFiltros: any) {
    this.cargandoMensajes = true;
    this.mensajesService.obtenerMensajes(parametrosFiltros).subscribe((resp: any) => {
      //console.log(resp)
      this.cargandoMensajes = false;
      if (resp.code == "200") {
        this.mensajesCargados = true;
        this.cargandoMensajes = false
        this.mensajeSinDatosCargados = true;
        this.mensajes = resp.data['datos:'];
        this.totalPaginas = resp.data['numeroPaginas:'];
        this.totalRegistros = resp.data['totalRegistros:'];
        // console.log(this.mensajes)
      } else {
        this.sinMensajesBuscar = false;
        this.mensajesCargados = false;
        this.cargandoMensajes = false;
        this.mensajes = [];
      }

    })
  }

  /**
  * Funcion que recibe el numero de pagina
  * y consulta los registros
  * @param valor
  */
  cambiarPagina(valor?: string) {
    if (valor === 'siguiente') {
      if (this.pagina < this.totalPaginas - 1) {
        this.pagina = this.pagina + 1
        this.parametrosFiltros.pagina = this.pagina
        this.mensajes = []
        this.cargarMensajes(this.parametrosFiltros);
      }
    }
    else if (this.pagina > 0) {
      this.pagina = this.pagina - 1;
      this.parametrosFiltros.pagina = this.pagina
      this.mensajes = []
      this.cargarMensajes(this.parametrosFiltros);
    }
  }

  verMensaje(id: any) {
    this.router.navigate([`./home/mensajes/ver/${id}`]);
  }

  async eliminarMensaje(id: any) {

    this.cargandoMensajes = true;
    let infoMensaje: any = {}
    infoMensaje.titulo = '';
    infoMensaje.mensaje = '¿Desea eliminar el mensaje?';
    infoMensaje.ventanaEnviado = false;
    infoMensaje.id = id;
    const modalRef = await this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infoMensaje = infoMensaje;
    modalRef.result.then((resultados) => {
      if (resultados == 'cerrado') {
        setTimeout(() => {
          this.mensajes = [];
          this.cargarMensajes(this.parametrosFiltros);
        }, 1000)
      }
    })

  }

  editarMensajes(id: any) {
    this.router.navigate([`./home/gestion-administrativa/mensajes/editar/${id}`]);
  }

  filtros(parametros_filtros: any) {
    this.mensajes = [];
    this.cargandoMensajes = true;
    this.mensajesCargados = true;

    if (parametros_filtros.fecha_final == "null-0null-0null") {
      parametros_filtros.fecha_final = "";
    }

    let datosUsuario: AccesoPerfil = this.usuarioService.obtenerAccesoSeleccionado();

    this.pagina = 0;
    this.parametrosFiltros.pagina = 0;
    this.parametrosFiltros.colegioId = parametros_filtros.colegio_id;
    this.parametrosFiltros.localidadId = parametros_filtros.localidad_id;
    this.parametrosFiltros.perfilId = parametros_filtros.perfilId;
    this.parametrosFiltros.usuarioId = this.usuarioLogueado.id;
    this.parametrosFiltros.perfilLoginId = datosUsuario.perfil.id;
    this.parametrosFiltros.fechaInicio = parametros_filtros.fecha_inicio;
    this.parametrosFiltros.fechaFinal = parametros_filtros.fecha_final;

    //console.log("Filtros: ", this.parametrosFiltros, parametros_filtros);

    this.cargarMensajes(this.parametrosFiltros);
  }

  /**
   * Nos permite actualizar el tamaño de la vista de la lista
   */
  actualizarTamano(valor: any) {
    this.parametrosFiltros.size = valor;
    let nuevoTotalPaginas = Math.round(this.totalResultados / valor);
    if (this.pagina >= nuevoTotalPaginas) {
      this.pagina = Math.max(nuevoTotalPaginas - 1, 0)
      this.parametrosFiltros.pagina = this.pagina;
      this.cargarMensajes(this.parametrosFiltros);
    }
    else {
      this.cargarMensajes(this.parametrosFiltros);
    }
  }


}
