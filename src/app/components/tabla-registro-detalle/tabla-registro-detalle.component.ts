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
    console.log(datos.target.value);
    this.buscar.emit(datos.target.value);
  }
}
