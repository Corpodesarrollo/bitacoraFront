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
export class RedireccionamientoInterceptorService implements HttpInterceptor {

  esMicrosoft: boolean = false;
  constructor(
    private authService: MsalService,
    private router: Router,
    private usuarioService: UsuarioService,
    private servicioModal: NgbModal
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
    console.log("Entraa: ", request);
    return next.handle(request)
        
  }
}
