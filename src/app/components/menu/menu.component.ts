import { Component, EventEmitter, Output, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { UtilsService } from 'src/app/services/generales/utils/utils.service';
import { ConfirmarCerrarSesionComponent } from '../confirmar-cerrar-sesion/confirmar-cerrar-sesion.component';
import { MenuGeneral } from 'src/app/classes/menu_general.interface';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {


  @Output() abrirOpcion = new EventEmitter<string>();

  mostrarMenu: boolean = true;
  esMicrosoft: boolean = false;
  cargandoMenu: boolean = false;
  usuarioId: number;
  institucionId: number;
  perfilId: number;
  rutactual: any = ''

  opcionActiva: any;
  opcionesMenu: any = []
  menuGeneral: any = []

  constructor(
    private authService: MsalService,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private ngZone: NgZone,
    private servicioModal: NgbModal
  ) {
    window.onresize = (e) => {
      //ngZone.run will help to run change detection
      this.ngZone.run(() => {
        if (window.innerWidth < 1199.98 && this.mostrarMenu === true) {
          this.mostrarMenu = false;
        }
      });
    };
    this.utilsService.menuMobile$.subscribe((respuesta) => {
      this.mostrarMenu = respuesta;
    })
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
    this.usuarioId = this.usuarioService.obtenerUsuario().id;
    let datos_usuario = this.usuarioService.obtenerPerfilUsuario()
    this.perfilId = datos_usuario.perfil.idPerfil;
    this.institucionId = datos_usuario.colegio.idColegio;
    if (this.usuarioId) {
      this.cargarMenu()
    }
  }

  ngOnInit(): void {

    if (window.innerWidth < 1199.98) {
      this.mostrarMenu = false;
    } else {
      this.mostrarMenu = true;
    }
  }

  cargarMenu() {
    let test_array = []
    let parametros = {
      perfil_id: this.perfilId,
      institucion_id: this.institucionId
    }
    this.cargandoMenu = true
    this.usuarioService.obtenerMenu(parametros).subscribe({
      next: (respuesta: any) => {
        if (respuesta.code == 200) {
          this.cargandoMenu = false;
         /*  this.menuGeneral = this.iconosMenuGeneral(respuesta.data.menuGeneralMenu) */
          let menu_catalogo = respuesta.data.menuServiceCatalog
          let menu_subCatalogo = respuesta.data.subMenuGeneralPrivate
          menu_catalogo.forEach((menu:any) => {
            const sub_opciones = menu_subCatalogo.filter((sub_menu: any) => menu.serRecurso === sub_menu.serCatCodigo);
            const etiqueta = menu.serTarget
            .normalize("NFD") // Normalizar
            .replace(/[\u0300-\u036f]/g, "") // Eliminar los diacríticos
            .trim()
            .toLowerCase()
            .replace(/[\s.]+/g, '');
            const ruta_icono = `assets/iconos/menu/${etiqueta}.svg`
            let recurso = {
              ...menu,
              opciones: sub_opciones,
              icono: ruta_icono
            }
            this.opcionesMenu.push(recurso);
          });
        }
      }
    })
  }

  iconosMenuGeneral(lista: MenuGeneral[]) {
    let nueva_lista = lista.map((opcion: any) => {
      const etiqueta = opcion.catImagen
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
        .replace(/[\s.]+/g, '');
      const ruta_icono = `assets/iconos/menu/${etiqueta}.svg`
      return {
        ...opcion,
        icono: ruta_icono
      }
    });
    return nueva_lista
  }

  abrirUrl(opcion: any) {
    if (window.innerWidth < 575.98) {
      this.utilsService.toggleMenuMobile();
    }
    let resolucion = window.innerWidth > 575.98 && window.innerWidth < 1199.98
    if (this.mostrarMenu && resolucion) {
      this.mostrarMenu = false
    }
    this.opcionActiva = opcion
    this.abrirOpcion.emit(opcion);
  }

  cambiarEstadoMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  cerrarSesion() {
    if (this.esMicrosoft) {
      this.usuarioService.cerrarSesion(this.esMicrosoft)
    }
    else {
      const modalRef = this.servicioModal.open(ConfirmarCerrarSesionComponent, { size: 'md', centered: true, backdrop: 'static' })
    }
  }

}
