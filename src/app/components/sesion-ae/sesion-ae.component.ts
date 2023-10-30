import { Component, inject } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-sesion-ae',
  templateUrl: './sesion-ae.component.html',
  styleUrls: ['./sesion-ae.component.scss']
})
export class SesionAEComponent {
  urlAE:any;

  domSanitizer = inject(DomSanitizer);

  ngOnInit(){
    let url ="https://pruebas-sed.linktic.com/apoyo_escolar/autenticaPaginas?bandera=0&Hinicio=22&Hfin=6&ext=1&key=0&cambio=&login=226&password=06020586a96e6ae27ff00174c72625ac";
    this.urlAE = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // cargaIFrame(iframe:any){
  //   console.log("Aca: ", iframe);
  // }
}
