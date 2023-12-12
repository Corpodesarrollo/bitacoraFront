import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnaTabla } from 'src/app/classes/columna_tabla.interface';
import { DatosTablaRegistroDetalle } from 'src/app/classes/datos_tabla_registro_detalle.interface';

@Component({
  selector: 'app-tabla-registro-detalle',
  templateUrl: './tabla-registro-detalle.component.html',
  styleUrls: ['./tabla-registro-detalle.component.scss'],
})
export class TablaRegistroDetalleComponent {
  @Input() titulo: string = 'titulo';
  @Input() subtitulo: string = 'subtitulo';
  @Input() datos: DatosTablaRegistroDetalle[] = [];
  @Input() columnasTabla: ColumnaTabla[] = [];
  @Output() exportarDatos: EventEmitter<any> = new EventEmitter<any>();
  @Output() buscar: EventEmitter<string> = new EventEmitter<string>();
  @Output() consultarDatos: EventEmitter<any> = new EventEmitter<any>();

  @Input() nPag:number = 0;
  @Input() itemXpag:number = 5;
  @Input() totalPag:number = 5;

  exportar(datos: any): void {
    let datosExportar: any;
    if (datos == 'excel' || datos == 'pdf') {
      datosExportar = { tipo: datos };
    } else {
      datosExportar = datos;
    }
    this.exportarDatos.emit(datosExportar);
  }
  buscarDatos(datos: any): void {
    this.buscar.emit(datos.target.value);
  }
  siguientePag():void {
    this.consultarDatos.emit(this.nPag+1);
  }
  anteriorPag():void {
    this.consultarDatos.emit(this.nPag-1);
  }
  ultimaPag():void {
    this.consultarDatos.emit(this.totalPag-1);
  }
  primeraPag():void {
    this.consultarDatos.emit(0);
  }
}
