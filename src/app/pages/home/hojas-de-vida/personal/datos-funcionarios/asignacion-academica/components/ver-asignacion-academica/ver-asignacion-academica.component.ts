import { Component, Input, inject } from '@angular/core';
import { Docente } from '../../../interfaces/docente';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ver-asignacion-academica',
  templateUrl: './ver-asignacion-academica.component.html',
  styleUrls: ['./ver-asignacion-academica.component.scss']
})
export class VerAsignacionAcademicaComponent {

  servicioModal = inject(NgbModal);
  @Input() infoFuncionario:any;


  cerrarModal(){
    this.servicioModal.dismissAll()
  }

  totalHorasAsignadasDocente:number = 35;
  numero_identificacion: boolean = true;

  listadoDocentes: Docente[] = [
    {
      'apellidoNombre': 'Acuña Fuentes Laura Alejandra',
      'tipoDocumento': 'CC',
      'numeroDocumento': '52013697',
      'asignatura': 'Biología',
      'grado': 'Primero',
      'grupo': '101',
      'numeroHoras': '5'
    },
    {
      'apellidoNombre': 'Acuña Fuentes Laura Alejandra',
      'tipoDocumento': 'CC',
      'numeroDocumento': '52013697',
      'asignatura': 'Biología',
      'grado': 'Primero',
      'grupo': '101',
      'numeroHoras': '3'
    },
    {
      'apellidoNombre': 'Acuña Fuentes Laura Alejandra',
      'tipoDocumento': 'CC',
      'numeroDocumento': '52013697',
      'asignatura': 'Biología',
      'grado': 'Primero',
      'grupo': '101',
      'numeroHoras': '4'
    },
    {
      'apellidoNombre': 'Acuña Fuentes Laura Alejandra',
      'tipoDocumento': 'CC',
      'numeroDocumento': '52013697',
      'asignatura': 'Biología',
      'grado': 'Primero',
      'grupo': '101',
      'numeroHoras': '2'
    },
  ]

  
  

}
