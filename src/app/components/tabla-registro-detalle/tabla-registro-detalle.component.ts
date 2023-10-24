import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnaTabla } from 'src/app/classes/columna_tabla.interface';
import { DatosBitacora } from 'src/app/classes/datos_bitacora.interface';
import { DatosTablaRegistroDetalle } from 'src/app/classes/datos_tabla_registro_detalle.interface';

@Component({
  selector: 'app-tabla-registro-detalle',
  templateUrl: './tabla-registro-detalle.component.html',
  styleUrls: ['./tabla-registro-detalle.component.scss'],
})
export class TablaRegistroDetalleComponent {
  @Input() titulo: string = 'titulo'; //test
  @Input() subtitulo: string = 'subtitulo';
  @Input() datos: DatosTablaRegistroDetalle[] = [];
  @Input() columnasTabla: ColumnaTabla[] = [];
  @Output() exportarDatos: EventEmitter<any>;

  exportar(datos:any): void {
    let datosExportar:any;
    if(datos=='excel' || datos=='pdf'){
      datosExportar={tipo:datos};
    }
    this.exportarDatos.emit(datosExportar);
  }
}
