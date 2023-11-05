import { Injectable } from '@angular/core';
import { DatosBitacora } from 'src/app/classes/datos_bitacora.interface';
import { DatosFiltrados } from 'src/app/classes/datos_filtrados.interface';

@Injectable()
export class BitacoraService {
  constructor() {}

  consultaBitacoras(filtros: DatosFiltrados): any[] {
    return [
      {
        fecha: new Date('23/10/2023'),
        modulo: 'PEI - Registro PEI',
        tipoLog: 'CAMBIO DE NOTA - ESTUDIANTE',
        usuario: 'Andres Felipe Gonzales Villa - DOCENTE',
        detalle: '{ "Grado": "7", "Grupo":"702","Periodo":"2","Estudiante":"Miguel Andres Bedoya Parra","Nota Anterior":"2","Nota Actualizada":"4","Recuperacion":"si"}',
      },
      {
        fecha: new Date('23/10/2023'),
        modulo: 'PEI - Registro PEI',
        tipoLog: 'Descarga de documentos',
        usuario: 'Andres Felipe Gonzales Villa - DOCENTE',
        detalle: '{ "Nombre documento": "documento 004.pdf", "Grupo":"702","Periodo":"2","Estudiante":"Miguel Andres Bedoya Parra"}',
      },
    ];
  }
}
