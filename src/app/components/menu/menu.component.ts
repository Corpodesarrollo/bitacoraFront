import { Component, EventEmitter, Output, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { UtilsService } from 'src/app/services/generales/utils/utils.service';
import { ConfirmarCerrarSesionComponent } from '../confirmar-cerrar-sesion/confirmar-cerrar-sesion.component';
import { MenuGeneral } from 'src/app/interfaces/menu_general.interface';
import { environment } from 'src/environments/environment';


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

  datos_usuario: any = {};
  opcionActiva: any;
  opcionesMenu: any = [];
  menuGeneral: any = [];
  listaParamServicio: any[] = [];
  recursoUrl: String;

  constructor(
    private authService: MsalService,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private ngZone: NgZone,
    private servicioModal: NgbModal,
    private router: Router
  ) {
    window.onresize = (e) => {
      //ngZone.run will help to run change detection
      this.ngZone.run(() => {
        if (window.innerWidth < 1199.98 && this.mostrarMenu == true) {
          this.mostrarMenu = false;
        }
      });
    };
    this.utilsService.menuMobile$.subscribe((respuesta) => {
      this.mostrarMenu = respuesta;
    })
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
    this.usuarioId = this.usuarioService.obtenerUsuario().id;
    this.datos_usuario = this.usuarioService.obtenerAccesoSeleccionado()
    this.perfilId = this.datos_usuario?.perfil.id;
    this.institucionId = this.datos_usuario?.colegio?.id;
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
      institucion_id: (this.institucionId) ? this.institucionId : 0
    }
    this.cargandoMenu = true
    this.usuarioService.obtenerMenu(parametros).subscribe({
      next: (respuesta: any) => {
        if (respuesta.code == 200) {
          this.cargandoMenu = false;
          let menu_general = this.iconosMenuGeneral(respuesta.data.menuGeneralMenu)
          const cerrar_sesion = menu_general[0]
          menu_general.splice(0, 1)
          menu_general.push(cerrar_sesion)
          this.menuGeneral = menu_general
          let menu_catalogo = respuesta.data.menuServiceCatalog
          let menu_subCatalogo = respuesta.data.subMenuGeneralPrivate
          menu_catalogo.forEach((menu: any) => {
            const sub_opciones = menu_subCatalogo.filter((sub_menu: any) => menu.serCatCodigo === sub_menu.serCatCodigo);
            const etiqueta = menu.catNombre
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
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
      const etiqueta = opcion.serNombre
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
    this.opcionActiva = opcion;
    let userId = Number(this.usuarioId !== null && this.usuarioId > 0 ? this.usuarioId : 0);
    let sede = (this.datos_usuario.sede !== null && this.datos_usuario.sede.id > 0 ? this.datos_usuario.sede.id : 0);
    let instituto = (this.datos_usuario.colegio !== null && this.datos_usuario.colegio.id > 0 ? this.datos_usuario.colegio.id : 0);
    let jornada = (this.datos_usuario.jornada !== null && this.datos_usuario.jornada.id > 0 ? this.datos_usuario.jornada.id : 0);

    let nivel = this.datos_usuario.perfil.idPerfilNivel !== null ? this.datos_usuario.perfil.idPerfilNivel : -1;
    let vigencia = (this.datos_usuario.colegio !== null && this.datos_usuario.colegio.vigencia > 0 ? this.datos_usuario.colegio.vigencia : 0);
    let municipio = 0;

    opcion.serRecurso = opcion.serRecurso.replace(/{{domain}}/g, environment.DOMAIN);
    opcion.serRecurso = opcion.serRecurso.replace(/{{userid}}/g, userId);
    opcion.serRecurso = opcion.serRecurso.replace(/{{sede}}/g, sede);
    opcion.serRecurso = opcion.serRecurso.replace(/{{inst}}/g, instituto);
    opcion.serRecurso = opcion.serRecurso.replace(/{{jornada}}/g, jornada);

    this.recursoUrl = opcion.serRecurso;

    if (this.recursoUrl.includes("http://") || this.recursoUrl.includes("https://")) {
      if (this.recursoUrl.toLowerCase().includes("apoyoescolarbe")) {
        if (nivel === 0) this.recursoUrl = `${this.recursoUrl}?inst=0`

        else if (nivel === 2) this.recursoUrl = `${this.recursoUrl}?inst=0`

        else this.recursoUrl = `${this.recursoUrl}?inst=${instituto}&amp;usuario=${userId}&amp;vigencia=${vigencia}&amp;sede=${sede}&amp;jornada=${jornada}`

      } else if (this.recursoUrl.toLowerCase().includes("apex")) {
        this.recursoUrl = `${instituto},${vigencia}`

      } else if (this.recursoUrl.toLowerCase().endsWith("students")) {
        this.recursoUrl = `${this.recursoUrl}/index/${userId}/${instituto}/${sede}/${jornada}`;

      } else if (this.recursoUrl.toLowerCase().endsWith("administrative/photo/") || this.recursoUrl.toLowerCase().includes("schools/photo")) {
        this.recursoUrl = `${this.recursoUrl}${userId}/${instituto}/${sede}/${jornada}`;

      } else if (this.recursoUrl.toLowerCase().includes("students/observersearch")) {
        this.recursoUrl = `${this.recursoUrl}/${userId}/${instituto}/${sede}/${jornada}`;

      } else {
        if (nivel === 0) this.recursoUrl = `${this.recursoUrl}?var=central`;

        else if (nivel === 2) this.recursoUrl = `${this.recursoUrl}?var=${municipio}`;

        else this.recursoUrl = `${this.recursoUrl}?var=${userId}-${instituto}-${sede}-${jornada}`;
      }
    }

    if (opcion !== null && opcion.serCodigo !== null && opcion.serCodigo.length > 0 && opcion.serTarget != 3) {
      // Se crea logica para agregar parametros a URL desde base de datos (Logica aplicativo NARANJA)
      this.usuarioService.obtenerParametrosServMenu(Number(opcion.serCodigo), null).subscribe(datos =>{
        let resultadoLocal: any = datos;
        if (resultadoLocal.code == 200) {
          this.listaParamServicio = resultadoLocal.data;
          if (this.listaParamServicio.length > 0) {
            this.listaParamServicio.forEach((reg) => {
              this.recursoUrl += (this.recursoUrl.includes("?"))? `&${reg.nombre}=${reg.valor}` : `?${reg.nombre}=${reg.valor}`;
            });
          }
          console.log("this.recursoUrl ==> ", this.recursoUrl);
        }

        if (window.innerWidth < 575.98) {
          this.utilsService.toggleMenuMobile();
        }
        let resolucion = window.innerWidth > 575.98 && window.innerWidth < 1199.98
        if (this.mostrarMenu && resolucion) {
          this.mostrarMenu = false
        }

        if (opcion.serCodigo == 2) {
          this.cerrarSesion()
        }
        if (opcion.serTarget === "1") {
          this.router.navigate(['/home/ver', environment.URL_APOYO_ESCOLAR + this.recursoUrl])
        } else if (opcion.serTarget === "4") {
          this.router.navigate(['/home/ver', this.recursoUrl])
        } else {
          this.router.navigate([`/home/${this.recursoUrl}`]);
        }
      },);
    }
    // Rederije a las rutas locales del aplativo azul
    else if (opcion.serTarget === "3") {
      this.router.navigate([`${this.recursoUrl}`]);
    }


  }


  cambiarEstadoMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  cerrarSesion() {
    if (window.innerWidth < 575.98) {
      this.utilsService.toggleMenuMobile();
    }
    if (this.esMicrosoft) {
      this.usuarioService.cerrarSesion(this.esMicrosoft)
    }
    else {
      const modalRef = this.servicioModal.open(ConfirmarCerrarSesionComponent, { size: 'md', centered: true, backdrop: 'static' })
      modalRef.result.then((result: any) => {
        if (result == false) {
          this.opcionActiva = null
        }
      })
    }
  }
}
