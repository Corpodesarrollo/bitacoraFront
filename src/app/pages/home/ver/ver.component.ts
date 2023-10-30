import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
  private activeRouter = inject(ActivatedRoute);


  private sanitizer = inject(DomSanitizer);
  mensaje: string = '';


  ngOnInit() {
    this.activeRouter.params.subscribe((params) => {
      let ruta = params['ruta']
      this.cargarUrl(ruta)
    })
  }

  cargarUrl(ruta: any) {
    this.esIframe = true
    this.cargandoIframe = true
    this.mensaje = "Un momento, estamos cargando la información";
    const url = environment.URL_APOYO_ESCOLAR + ruta
    this.urlIframe = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    setTimeout(() => {
      this.cargandoIframe = false
    }, 5000)
  }
}
