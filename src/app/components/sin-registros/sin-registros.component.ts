import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sin-registros',
  template: '<label class="sin_registros">{{mensaje}}</label>',
  styleUrls: ['./sin-registros.component.scss']
})
export class SinRegistrosComponent {
  @Input() mensaje = "No se encontraron registros";
  constructor() { }
}
