import { Component, HostListener, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { UtilsService } from 'src/app/services/generales/utils/utils.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  private router = inject(Router);
  usuarioService = inject(UsuarioService)
  authService = inject(MsalService)
  utilsService = inject(UtilsService)


  url: string = '';
  esMicrosoft: boolean
  estaRecargando = false;


  ngOnInit() {
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;

  }

  @HostListener('window:beforeunload', ['$event'])
  cargarNotificacion(event: any): void {
    let es_desarrollo = environment.es_desarrollo
    if (!this.estaRecargando && !es_desarrollo) {
      const mensaje = '¿Seguro que deseas cerrar la sesión?';
      event.returnValue = mensaje
      localStorage.clear()
      sessionStorage.clear()
    }
  }

  @HostListener('window:keydown', ['$event'])
  cambioEstadoRecargaF(event: KeyboardEvent): void {
    if (event.key === 'F5') {
      this.estaRecargando = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  cambioEstadoRecarga(event: KeyboardEvent): void {
    if (event.key === 'F5') {
      this.estaRecargando = true;
    }
  }

}


