import { Component, OnInit } from '@angular/core';
import { ColumnaTabla } from 'src/app/classes/columna_tabla.interface';
import { DatosBitacora } from 'src/app/classes/datos_bitacora.interface';
import { BitacoraService } from './services/bitacora/bitacora.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss'],
})
export class BitacoraComponent implements OnInit {
  columnasTablaBitacora: ColumnaTabla[] = [
    { titulo: 'Fecha-Hora', campo: 'fecha' },
    { titulo: 'Usuario-Perfil', campo: 'usuario' },
    { titulo: 'Modulo-submodulo', campo: 'modulo' },
    { titulo: 'Tipo de Log', campo: 'tipoLog' },
  ];

  datosBitacora: DatosBitacora[] = [];

  public constructor(private bitacoraService: BitacoraService) {}

  ngOnInit(): void {
    this.consultarBitacora();
  }

  private consultarBitacora(): void {
    this.datosBitacora = this.bitacoraService.consultaBitacoras();
  }

  exportar(datos: any): void {
    if (datos?.fila == undefined) {
      //consumo exportar todo
    } else {
      //consumo exportar individual
    }
    console.log(datos);
  }
}
