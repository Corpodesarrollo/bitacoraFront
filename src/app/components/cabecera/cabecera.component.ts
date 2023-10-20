import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { HostListener, ElementRef } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { UtilsService } from 'src/app/services/generales/utils/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmarCerrarSesionComponent } from '../confirmar-cerrar-sesion/confirmar-cerrar-sesion.component';
import { PoliticaDatosComponent } from 'src/app/pages/login/politica-datos/politica-datos.component';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})
export class CabeceraComponent implements OnInit {
  /* Perfiles Administrador */
  perfilAdmin = 'adminsec'

  version: string = environment.VERSION;
  menuMobile: any = true;
  mostrarConsultas: boolean = true;
  mostrarCerrar: boolean = true;

  usuario: any;
  toggleUser: boolean = false;
  mostrarElemento: boolean;

  colegioGuardado: string = '';
  sedeGuardada: string = '';
  jornadaGuardada: string = '';
  foto_guardada: string = '';
  rolGuardado: string = '';
  etiquetaGuardada: string = '';
  esMicrosoft: boolean = false;
  unicoRegistro: boolean = false;
  nombreUsuario: string = '';

  idUsuario: any;
  perfilUsuario: any;

  constructor(
    private elementRef: ElementRef,
    private authService: MsalService,
    private router: Router,
    private usuarioService: UsuarioService,
    private servicioModal: NgbModal,
    private utilsService: UtilsService) {
    this.mostrarElemento = true;
    this.utilsService.menuMobile$.subscribe((respuesta) => {
      this.menuMobile = respuesta;
    });
    this.usuario = this.usuarioService.obtenerUsuario();
    this.idUsuario = this.usuario.id;
    this.unicoRegistro = this.usuarioService.obtenerUnicoRegistro()

    const nombre = this.usuarioService.obtenerUsuario().nombre;
    this.nombreUsuario = this.removerNulos(nombre)
  };

  removerNulos(value: string): string {
    if (!value) return value;
    return value.split(' ').filter(word => word.toLowerCase() !== 'null').join(' ');
  }

  ngOnInit(): void {
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
    const rutaActual = this.router.url;
    if (rutaActual === '/login' || rutaActual === '/login/seleccionar-perfil' || rutaActual === '/login/cambiar-contrasenia' || rutaActual === '/login/consultas') {
      this.mostrarElemento = false;
    }
    if (rutaActual != '/login/consultas') {
      this.mostrarConsultas = false;
    }

    this.mostrarCerrar = rutaActual === '/login/seleccionar-perfil';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const nuevaRuta = event.urlAfterRedirects;
        if (nuevaRuta === '/login/consultas') {
          this.mostrarConsultas = true;
        } else {
          this.mostrarConsultas = false;
        }
        this.mostrarCerrar = nuevaRuta === '/login/seleccionar-perfil';
      }
    });

    const institutoGuardado = this.usuarioService.obtenerPerfilUsuario();
    if (institutoGuardado) {
      this.colegioGuardado = institutoGuardado.colegio.colegio_guardado;
      this.sedeGuardada = institutoGuardado.sede.sede_guardada;
      this.jornadaGuardada = institutoGuardado.jornada.jornada_guardada;
      this.foto_guardada = institutoGuardado.foto_ie;
      this.rolGuardado = institutoGuardado.perfil.rol_usuario;
      this.etiquetaGuardada = institutoGuardado.perfil.etiqueta
    };
  };

  cerrarSesion() {
    if (this.esMicrosoft) {
      this.usuarioService.cerrarSesion(this.esMicrosoft)
    }
    else {
      const modalRef = this.servicioModal.open(ConfirmarCerrarSesionComponent, { size: 'md', centered: true, backdrop: 'static' })
    }
  };

  toggleInfo() {
    this.usuario = this.usuarioService.obtenerUsuario();
    this.toggleUser = !this.toggleUser
  };

  toggleDropdown() {
    this.toggleUser = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.toggleUser) {
      this.toggleUser = false;
    };
  };

  irInicio() {
    const ruta = this.router.url;
    if (ruta === '/login/seleccionar-perfil' || ruta === '/login/consultas') {
      this.router.navigate(['login']);
    }
    else {
      this.router.navigate(['home']);
    }
  };

  cambiar() {
    this.usuarioService.borrarSeleccionColegio();
    this.router.navigateByUrl("/login/seleccionar-perfil")
  };

  contrasena() {
    this.router.navigateByUrl("/home/cambiar-contrasenia")
  };

  mostarMenu() {
    this.utilsService.toggleMenuMobile();
  };

};
