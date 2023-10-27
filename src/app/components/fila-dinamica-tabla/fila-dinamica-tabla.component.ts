import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnaTabla } from 'src/app/classes/columna_tabla.interface';
import { DatosTablaRegistroDetalle } from 'src/app/classes/datos_tabla_registro_detalle.interface';
@Component({
  selector: 'app-fila-dinamica-tabla',
  templateUrl: './fila-dinamica-tabla.component.html',
  styleUrls: ['./fila-dinamica-tabla.component.scss'],
})
export class FilaDinamicaTablaComponent implements OnInit {
  @Input() fila: DatosTablaRegistroDetalle;
  @Input() columnasTabla: ColumnaTabla[];
  @Input() descripcionBotonesDescarga: string = 'descripcion botones descarga';
  @Output() exportarDatos: EventEmitter<any> = new EventEmitter<any>();

  columnasDetalle: ColumnaTabla[] = [];
  filaDetalle: any;
  keyDetalle: string;
  isSelected: boolean = false;
  constructor() {}
  ngOnInit(): void {
    this.getDetalle();
  }

  getDetalle(): void {
    let columnasDetalleNuevo: ColumnaTabla[] = [];
    let filaDetalleNuevo: any;
    const fila = this.fila;
    const keys = Object.keys(fila);
    keys.forEach((key) => {
      try {
        const detalleKeys = Object.keys(JSON.parse(fila[key]));
        detalleKeys.forEach((detalle) => {
          columnasDetalleNuevo.push({ titulo: detalle, campo: detalle });
          filaDetalleNuevo = JSON.parse(fila[key]);
        });
      } catch (e) {}
    });
    this.columnasDetalle = columnasDetalleNuevo;
    this.filaDetalle = filaDetalleNuevo;
  }
  exportar(tipo: string, fila: any): void {
    let datos: any = { tipo: tipo, fila: fila };
    this.exportarDatos.emit(datos);
  }
}
