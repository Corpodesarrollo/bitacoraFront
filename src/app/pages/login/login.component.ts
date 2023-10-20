import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { TokenService } from 'src/app/services/api/token/token.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { ErrorInicioComponent } from './error-inicio/error-inicio.component';


const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
type ProfileType = {
  givenName?: string;
  surname?: string;
  userPrincipalName?: string;
  id?: string;
  displayName?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  esMicrosoft: boolean = false;
  cargandoOffice365: boolean = true;
  profile!: ProfileType;



  constructor(
    private serviciosToken: TokenService,
    private servicioModal: NgbModal,
    private msalBroadcastService: MsalBroadcastService,
    private authService: MsalService,
    private serviciosUsuario: UsuarioService,
    private router: Router,
    private http: HttpClient

  ) {

    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 1;
    if (this.esMicrosoft) {
      this.getProfile();
    }
  }

  ngOnInit() {

    let office_365 = sessionStorage.getItem('sap_sec_office365');
    if (office_365) {
      this.authService.loginRedirect()
      this.msalBroadcastService.msalSubject$ /**Validar usuario microsoft */
        .pipe(
          filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        )
        .subscribe(async (result: EventMessage) => {
          this.cargandoOffice365 = true;
          const payload = result.payload as AuthenticationResult;
          this.authService.instance.setActiveAccount(payload.account);
          let nombre_usuario = this.authService.instance.getActiveAccount()?.username;
          this.obtenertoken(nombre_usuario)
        });

      this.msalBroadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None)
        )
        .subscribe(async () => {
          sessionStorage.clear()
          this.configurarLogin();
        })
    }
    else {
      this.cargandoOffice365 = false;
    }

  }


  configurarLogin() {
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
  }

  async obtenertoken(nombre_usuario: any) {
    let token = this.serviciosToken.getToken().token;
    if (!token && nombre_usuario) {
      await this.serviciosUsuario.validarUsuario(nombre_usuario).subscribe({
        next: (respuesta: any) => {
          if (respuesta) {
            if (respuesta.exito) {
              let segPorDia = 1 / 86400;
              let tiempoSesion = segPorDia * respuesta.usuario.expira_en;
              const nuevo_usuario = {
                "id": respuesta.usuario.id,
                "token": respuesta.usuario.userDetails.token
              }
              /*  this.serviciosToken.configurarToken(JSON.stringify(nuevo_usuario), tiempoSesion); */
              this.serviciosToken.configurarTokenLocal(JSON.stringify(nuevo_usuario));
              const usuario = {
                ...respuesta.usuario
              }
              delete usuario.token
              delete usuario.expira_en
              this.serviciosUsuario.configurarUsuario(JSON.stringify(usuario));
              sessionStorage.removeItem('sap_sec_office365');
              this.cargandoOffice365 = false
              this.router.navigate(['login/seleccionar-perfil'])
            }
            else {
              sessionStorage.clear();
              sessionStorage.removeItem('sap_sec_office365');
              this.serviciosUsuario.removerUsuario();
              this.cargandoOffice365 = false;
              const modalRef = this.servicioModal.open(ErrorInicioComponent, { size: '602px', centered: true, animation: false, backdrop: 'static' });
              modalRef.componentInstance.usuarioNoEncontrado = true;
              modalRef.result.then(() => {
                this.authService.logout({});
                modalRef.componentInstance.usuarioNoEncontrado = false;
              })

            }
          }
          else {
            sessionStorage.clear();
            sessionStorage.removeItem('sap_sec_office365');
            this.serviciosUsuario.removerUsuario();
            this.cargandoOffice365 = false;
            const modalRef = this.servicioModal.open(ErrorInicioComponent, { size: '602px', centered: true, animation: false, backdrop: 'static' });
            modalRef.componentInstance.usuarioNoEncontrado = true;
            modalRef.result.then(() => {
              this.authService.logout({});
              modalRef.componentInstance.usuarioNoEncontrado = false;
            })
          }
        },
        error: (error: any) => {
          sessionStorage.clear();
          sessionStorage.removeItem('sap_sec_office365');
          this.serviciosUsuario.removerUsuario();
          this.authService.logout({});
          this.cargandoOffice365 = false;
          const modalRef = this.servicioModal.open(ErrorInicioComponent, { size: '602px', centered: true, animation: false, backdrop: 'static' });
          modalRef.componentInstance.usuarioNoEncontrado = true;
          modalRef.result.then(() => {
            this.authService.logout({});
            modalRef.componentInstance.usuarioNoEncontrado = false;
          })
        },
      })
    }
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT).subscribe((profile) => {
      this.profile = profile;
    });
  }
}
