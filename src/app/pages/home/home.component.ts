import { Component, HostListener, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  usuarioService = inject(UsuarioService)
  authService = inject(MsalService)

  esIframe: boolean = false;
  cargandoIframe: boolean = true;
  urlIframe: any = '';
  url: string = '';
  mensaje: string = '';
  esMicrosoft: boolean
  estaRecargando = false;


  ngOnInit() {
    this.esIframe = false;
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

  ngOnDestroy(): void {
    this.esIframe = false;
  }



  abrirUrl(opcion: any) {
    if (opcion.serTarget === "1") {
      this.router.navigate(['/home'])
      this.esIframe = true
      this.cargandoIframe = true
      this.mensaje = "Un momento, estamos cargando la información"
      const url = opcion.url
      this.urlIframe = this.sanitizer.bypassSecurityTrustResourceUrl(url)
      setTimeout(() => {
        this.cargandoIframe = false
      }, 5000)
    }
    else if(opcion.serTarget === "3"){
      this.esIframe = false;
      this.router.navigate([`${opcion.serRecurso}`]);
    }
    else {
      this.esIframe = false;
      this.router.navigate([`/home/${opcion.serRecurso}`]);
    }
  }
}


