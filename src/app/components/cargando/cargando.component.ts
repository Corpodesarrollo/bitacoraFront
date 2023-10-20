import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.component.html',
  styleUrls: ['./cargando.component.scss']
})
export class CargandoComponent {
  @Input() mensaje = "Cargando...";
  @Input() tamanio = "grande";
}
