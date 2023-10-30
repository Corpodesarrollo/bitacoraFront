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
import { CookieService } from 'ngx-cookie-service';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';
import { environment } from 'src/environments/environment';



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
    private politicasService: PoliticasService,

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
      contrasenia: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(200)]],
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
      // let contraseniaHash = MD5(contrasenia).toString();
      let contraseniaHash = contrasenia;
      let credenciales: any = {
        usuario: this.formLogin.get('usuario').value,
        contrasenia: contraseniaHash
      }
      this.abrirSesionAE(credenciales);
      this.servicioUsuario.ingresar(credenciales).subscribe({
        next: (respuesta: any) => {
          if (respuesta.exito) {
            if (respuesta.usuario.cambiar_contrasenia === true) {
              const nuevo_usuario = {
                "id": respuesta.usuario.id,
              }
              this.servicioUsuario.configurarUsuario(JSON.stringify(nuevo_usuario));
              this.router.navigate(['login/cambiar-contrasenia']);
              this.ingresando = false
            } else {
              this.ingresando = false
              const nuevo_usuario = {
                "id": respuesta.usuario.id,
                "token": respuesta.usuario.userDetails.token
              }
              this.serviciosToken.configurarTokenLocal(JSON.stringify(nuevo_usuario));
              const usuario = {
                ...respuesta.usuario
              }
              delete usuario.token
              delete usuario.expira_en
              delete usuario.userDetails
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

  abrirSesionAE(credenciales:{usuario: string, contrasenia:string}){

    //let url = `${environment.URL_APOYO_ESCOLAR}/autenticaPaginas?bandera=0&Hinicio=22&Hfin=6&ext=1&key=0&cambio=&login=${credenciales.usuario}&password=${credenciales.contrasenia}&urlPag=${environment.URL_APOYO_ESCOLAR}/bienvenida.do`;
    let url = `${environment.URL_APOYO_ESCOLAR}/autenticaPaginas?bandera=0&Hinicio=22&Hfin=6&ext=1&key=0&cambio=&login=226&password=06020586a96e6ae27ff00174c72625ac&urlPag=${environment.URL_APOYO_ESCOLAR}/bienvenida.do`;
    var nuevaVentana =window.open(url,'_blank','toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=20000, top=20000, width=2, height=2, visible=none');
    setTimeout(() => {
      nuevaVentana.close();
    }, 2000);
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

  /**
   * Meotdo que carga las imagenes del carrusel
   */
  cargarImagenes() {
    const numeroImagenes = 59; // Imagenes en carpeta
    const ruta = "assets/img/slides_acceso_perfil/";
    for (let i = 1; i <= numeroImagenes; i++) {
      const url = ruta + 'img-' + i + '.jpg';
      this.slides.push({ url });
    }
  }

}
