import { Component, Input, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajeModal } from '../../../../../gestion-administrativa/enviar-mensajes/components/mensaje-modal/mensaje-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-asignaciones-funcionario',
  templateUrl: './asignaciones-funcionario.component.html',
  styleUrls: ['./asignaciones-funcionario.component.scss']
})
export class AsignacionesFuncionarioComponent {

  @Input() infoAsignacionFuncionario: any;

  allChecked: boolean = false;

  formulario!: FormGroup;

  public infoMensaje:any = {
    titulo: '',
    mensaje: '',
    emisor: ''
  }

  infoAsignatura = {
    biologia: {
      materia: "Biologia",
      totalHoras: "35",
      horasDisponibles: "10",
      aulas: [
        {
          numeroAula: "Primero",
          asignaturasAulas: [
            { numero: '101', horas: 5 },
            { numero: '102', horas: 3 },
            { numero: '103', horas: 2 },
            { numero: '104', horas: 5 },
          ],
          horas: 15
        },
        {
          numeroAula: "Segundo",
          asignaturasAulas: [
            { numero: '101', horas: 2 },
            { numero: '102', horas: 3 },
            { numero: '103', horas: 2 },
            { numero: '104', horas: 4 },
          ],
          horas: 11
        }
      ]
    }
  }

  constructor(private servicioModal: NgbModal,
    private formBuilder: FormBuilder) {
      this.construirFormulario();
  }

  construirFormulario() {
    this.formulario = this.formBuilder.group({
      totalHoras: ['', []],
      infoHoras: [''],
      infoHorasAula: [''],
      infoHorasNumeroAula: [''],
      infoTotalHoras: ['']
    });
  }


  inputTodos(e: any) {
    if (e.target.checked) {
      this.toggleAll();
    } else {
      this.toggleAll();
    }
  }

  toggleAll() {
    this.allChecked = !this.allChecked;
    this.infoAsignatura.biologia.aulas.forEach(element => {
      //console.log('asasasd')
      // element.checked = this.allChecked
    });
  }


  cerrarModal() {
    this.infoMensaje.titulo = 'Confirmación de cierre';
    this.infoMensaje.mensaje = '¿Está seguro de cerrar asignación académica?';
    this.infoMensaje.ventanaEnviado = true
    this.infoMensaje.botonesAsignacionFuncionarioConfirmarC = true;
    const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infoMensaje = this.infoMensaje;
    modalRef.result.then(() => {
      // console.log('cerrado modal');
      // this.servicioModal.dismissAll()
    })
  }

}
