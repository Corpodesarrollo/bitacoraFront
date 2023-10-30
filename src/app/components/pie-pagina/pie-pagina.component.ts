import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.component.html',
  styleUrls: ['./pie-pagina.component.scss']
})
export class PiePaginaComponent {

  urlPolitcas:string = environment.URL_POLITICA_DATOS;
}
