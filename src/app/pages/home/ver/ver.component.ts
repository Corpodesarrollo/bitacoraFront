import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { niveles } from 'src/app/enums/niveles.enum';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.scss']
})
export class VerComponent {

  esIframe: boolean = false;
  cargandoIframe: boolean = true;
  urlIframe: any = '';
  mensaje: string = '';
  
  private activeRouter = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private serviciosUsuario = inject(UsuarioService)

  ngOnInit() {
    this.activeRouter.params.subscribe((params) => {
      let ruta = params['ruta']
      this.cargarUrl(ruta)
    });
    this
  }

  cargarUrl(ruta: any) {
    this.esIframe = true
    this.cargandoIframe = true
    this.mensaje = "Un momento, estamos cargando la información";
    const accesoSel  = this.serviciosUsuario.obtenerAccesoSeleccionado();
    let url = ruta;
    
    //console.log("URL: ", url);
    this.urlIframe = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    setTimeout(() => {
      this.cargandoIframe = false
    }, 1500)
  }

}
