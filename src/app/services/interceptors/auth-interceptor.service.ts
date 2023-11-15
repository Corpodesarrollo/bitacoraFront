import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable, filter, map, tap } from 'rxjs';
import { UsuarioService } from '../api/usuario/usuario.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmarCerrarSesionComponent } from 'src/app/components/confirmar-cerrar-sesion/confirmar-cerrar-sesion.component';
import { MensajeModal } from 'src/app/pages/home/gestion-administrativa/enviar-mensajes/components/mensaje-modal/mensaje-modal';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  esMicrosoft: boolean = false;
  constructor(
    private authService: MsalService,
    private router: Router,
    private usuarioService: UsuarioService,
    private serviciosModal: NgbModal
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            if(event.status == 403) {
              this.usuarioService.cerrarSesion(this.esMicrosoft); 
              this.mensajeEliminado();
            }
          }
          return event;
        },
        error: (error) => {
          if(error.status === 403) {
              this.usuarioService.cerrarSesion(this.esMicrosoft);
              this.mensajeEliminado();
          }
        }
      }));
  }

  mensajeEliminado(){
    setTimeout(()=>{
      let infoMensaje: any = {}
      infoMensaje.titulo = 'Su sesion ha caducado.';
      infoMensaje.mensaje = 'Por favor, inicie sesión de nuevo.';
      const modalRef = this.serviciosModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = infoMensaje;
    },1000);

    setTimeout(()=>{
      this.serviciosModal.dismissAll();
    },3000)
  }
}
