import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { MD5 } from 'crypto-js';


import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

import { ErrorInicioComponent } from '../error-inicio/error-inicio.component';
import { RecuperarContraseniaComponent } from '../recuperar-contrasenia/recuperar-contrasenia.component';
import { TokenService } from 'src/app/services/api/token/token.service';
import { Subject, filter, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { PoliticaDatosComponent } from '../politica-datos/politica-datos.component';



@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.scss']
})
export class IngresarComponent {

  formLogin: any;
  ingresando: boolean = false;
  verContrasenia: boolean = false;
  cambiarContrasenia: boolean = false;

  //Microsoft
  isIframe = false;
  esMicrosoft = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private servicioModal: NgbModal,
    private authService: MsalService,
    private servicioUsuario: UsuarioService,
    private serviciosToken: TokenService,
    private router: Router,
    private cookieService: CookieService,
    private msalBroadcastService: MsalBroadcastService,

  ) {
    this.construirFormularios();
    this.cargarImagenes();
  }

  slides: any[] = []

  ngOnInit(): void {
    let token = this.serviciosToken.getToken().token;
    if (token) {
      this.router.navigate(['login/seleccionar-perfil'])
    }
    else {
      this.router.navigate(['login'])
    }

    //toDo Si no tiene el token y tiene la bandera de configurar politicas vuelva y abra el modal
    this.isIframe = window !== window.parent && !window.opener;
    this.configurarLogin();
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/login";
        } else {
          this.configurarLogin();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(async () => {
        await this.configurarLogin();
        await this.validarConfigurarCuentaActiva();
      })
  }

  configurarLogin() {
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
  }

  validarConfigurarCuentaActiva() {
    let activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }


  /**
 * Ingreso login microsoft
 */
  login() {
    sessionStorage.clear();
    sessionStorage.setItem('sap_sec_office365', "true")
    this.authService.loginRedirect();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  /**
  * Construye el formulario de login
  */
  construirFormularios() {
    this.formLogin = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.maxLength(15), Validators.pattern('^[0-9]+')]],
      contrasenia: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  campoNoValido(campo: string) {
    return this.formLogin.get(campo).invalid && this.formLogin.get(campo).touched;
  }

  /**
   * Ingreso
   */

  ingresar() {
    if (this.formLogin.invalid) {
      Object.values(this.formLogin.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    } else {
      localStorage.clear();
      sessionStorage.clear();
      this.cookieService.deleteAll()
      this.servicioUsuario.removerUsuario();
      this.ingresando = true;
      let contrasenia = this.formLogin.get('contrasenia').value.toString();
      //ToDo volver a poner cotnrasena hash
      let contraseniaHash = MD5(contrasenia).toString();
      let credenciales: any = {
        usuario: this.formLogin.get('usuario').value,
        contrasenia: contraseniaHash,
      }
      this.servicioUsuario.ingresar(credenciales).subscribe({
        next: (respuesta: any) => {
          if (respuesta.exito) {

            this.ingresando = false
            let segPorDia = 1 / 86400;
            let tiempoSesion = segPorDia * respuesta.expira_en;
            //Todo Si tiene la bandera de politicas abrir el modal, configurarlo en local storage y no crear el token
            if (respuesta.usuario.cambiar_contrasenia === true) {
              const nuevo_usuario = {
                "id": respuesta.usuario.id,
              }
              this.servicioUsuario.configurarUsuario(JSON.stringify(nuevo_usuario));
              this.router.navigate(['login/cambiar-contrasenia']);

            }
            else {
              const nuevo_usuario = {
                "id": respuesta.usuario.id,
                "token": respuesta.usuario.userDetails.token
              }
              this.serviciosToken.configurarTokenLocal(JSON.stringify(nuevo_usuario));
              /*  this.serviciosToken.configurarToken(JSON.stringify(nuevo_usuario), tiempoSesion); */
              const usuario = {
                ...respuesta.usuario
              }
              delete usuario.token
              delete usuario.expira_en
              this.servicioUsuario.configurarUsuario(JSON.stringify(usuario));
              this.router.navigate(['login/seleccionar-perfil']);
            }
          }
          else {
            this.ingresando = false;
            this.servicioModal.open(ErrorInicioComponent, { size: '600px', centered: true, animation: false, backdrop: 'static' });
          }
        },
        error: (error: any) => {
          this.ingresando = false;
          this.servicioModal.open(ErrorInicioComponent, { size: '600px', centered: true, animation: false, backdrop: 'static' });
        },
      })
    }
  }

  /**
   * Metodo que recibe la contrasenia
   * y abre ubna nueva sesion para el tema del manejo
   * de los i frames en el menu princia0pl
   * @param credenciales
   */
  crearNuevaSesion(credenciales:any) {
    const url = `https://apoyopruebas.educacionbogota.edu.co/apoyo_escolar/autenticaPaginas?bandera=0&Hinicio=22&Hfin=6&ext=1&key=0&cambio=&login=1230021&password=${credenciales.contrasenia}`
    const opcionesVentana = 'width=20,height=20';
    const nuevaPestana = window.open(url, '_blank', opcionesVentana);
    setTimeout(() => {
      nuevaPestana?.close();
    }, 10000);
  }

  /**
  * Abre el modal para recuperar la contrasenia
  */
  abrirRecuperarContrasena() {
    const modal_recuperar = this.servicioModal.open(RecuperarContraseniaComponent, { size: 'md', centered: true, backdrop: 'static' });
  }

  /**
  * Visualizar el password
  */
  mostrarContrasenia() {
    this.verContrasenia = !this.verContrasenia
  }

  cargarImagenes() {
    const numeroImagenes = 59; // Imagenes en carpeta
    const ruta = "assets/img/slides_acceso_perfil/";
    for (let i = 1; i <= numeroImagenes; i++) {
      const url = ruta + 'img-' + i + '.jpg';
      this.slides.push({ url });
    }
  }

  verPoliticas() {
    const modalPoliticas = this.servicioModal.open(PoliticaDatosComponent, { modalDialogClass: 'modal-politicas', centered: true, animation: false, backdrop: 'static' })
    modalPoliticas.result.then((result) => {
      if (result) {
        this.router.navigate(['login/seleccionar-perfil']);
      }
      else {
        this.servicioUsuario.cerrarSesion(this.esMicrosoft)
      }
    })
  }

}
