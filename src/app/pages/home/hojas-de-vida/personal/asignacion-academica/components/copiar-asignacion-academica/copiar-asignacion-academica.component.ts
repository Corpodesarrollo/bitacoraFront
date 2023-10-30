import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '../../interfaces/docente';
import { AsignacionAcademicaService } from 'src/app/services/api/personal/asignacion-academica.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { asignacionAcademica } from '../../interfaces/asignacion-academica.interface';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-copiar-asignacion-academica',
  templateUrl: './copiar-asignacion-academica.component.html',
  styleUrls: ['./copiar-asignacion-academica.component.scss']
})
export class CopiarAsignacionAcademicaComponent implements OnInit, OnDestroy {


  distanciaScroll: any = 0;
  tiempoEsperaScroll: any;
  docenteSeleccionado: Docente;
  cargandoRegistros: boolean = false;
  cargandoAsignacion: boolean = false;
  copiandoRegistros: boolean = false;
  errorEncontrado: boolean = false;
  listaAsignacionDocente: asignacionAcademica[] = []
  formFuncionarios!: any;

  institucionId: any;
  sedeId: any;
  jornadId: any;
  metodologiaId: any;
  vigencia: any;

  parametrosFiltros: any = {
    sort: "primernombre,desc",
    size: 10000,
    page: 0,
  }

  @Input() informacionDocente: any;
  @Input() parametrosUsuario: any;

  constructor(
    private activeModal: NgbActiveModal,
    private serviciosModal: NgbModal,
    private asignacionAcademicaService: AsignacionAcademicaService,
    private formBuilder: FormBuilder
  ) {
  }

  /**
   * Recibe la informacion y la agrega al docente
   */

  ngOnInit(): void {
    this.docenteSeleccionado = this.informacionDocente
    this.institucionId = this.parametrosUsuario.institucion_id
    this.sedeId = this.parametrosUsuario.sede_id
    this.jornadId = this.parametrosUsuario.jornada_id
    this.metodologiaId = this.parametrosUsuario.metodologia_id
    this.vigencia = this.parametrosUsuario.vigencia
    console.log(this.parametrosUsuario);
    this.construirFormulario()
    this.cargarListas()
  }

  /**
   * Metodo para consturir el formulario
   */

  construirFormulario() {
    this.formFuncionarios = this.formBuilder.group({
      lista_funcionarios: this.formBuilder.array([])
    })
  }

  /**
  * Obtiene la lista de funcionarios
  */
  get listaFuncionarios() {
    return this.formFuncionarios.get('lista_funcionarios') as FormArray;
  }

  /**
  * Metodo para crear un nuevo elemento
  */
  agregarElemento(docente: any = null) {
    this.listaFuncionarios.push(this.nuevoElemento(docente));
  }

  /**
 * Nuevo funcionario
 */
  nuevoElemento(funcionario: any = null) {
    let identificacion = ""
    let primer_apellido = ""
    let segundo_apellido = ""
    let primer_nombre = ""
    let segundo_nombre = ""

    if (funcionario) {
      if (funcionario.identificacion) identificacion = funcionario.identificacion
      if (funcionario.primerApellido) primer_apellido = funcionario.primerApellido
      if (funcionario.segundoApellido) segundo_apellido = funcionario.segundoApellido
      if (funcionario.primerNombre) primer_nombre = funcionario.primerNombre
      if (funcionario.segundoNombre) segundo_nombre = funcionario.segundoNombre
    }
    let funcionarioGroup = this.formBuilder.group({
      identificacion: identificacion,
      seleccionado: [false],
      primer_nombre: primer_nombre,
      segundo_nombre: segundo_nombre,
      primer_apellido: primer_apellido,
      segundo_apellido: segundo_nombre,
    });

    return funcionarioGroup
  }

  /**
   * Metodo que obitene la lista de docentes,
   * adicional tambien obitene la asignacion o intensidad
   * horaria del docente selecciondo
   */
  cargarListas() {
    this.cargandoRegistros = true;
    this.cargandoAsignacion = true;

    this.asignacionAcademicaService.obtenerDocentesSinAsignacion(this.institucionId, this.sedeId, this.jornadId, this.metodologiaId, this.vigencia, this.parametrosFiltros).subscribe({
      next: (respuesta: any) => {
        let funcionarios = respuesta.data.filter((docente: any) => docente.identificacion != this.docenteSeleccionado.identificacion);
        this.crearFuncionarios(funcionarios)
        this.parametrosFiltros.total_paginas = respuesta.data.totalPages;
        console.log(this.parametrosFiltros);
        this.cargandoRegistros = false;
      }
    })

    let parametros = {
      institucion_id: this.parametrosUsuario.institucion_id,
      metodologia_id: this.parametrosUsuario.metodologia_id,
      vigencia: this.parametrosUsuario.vigencia,
      sede_id: this.parametrosUsuario.sede_id,
      jornada_id: this.parametrosUsuario.jornada_id,
      documento_docente: this.docenteSeleccionado.identificacion,
    }
    this.asignacionAcademicaService.obtenerintensidadHoraria(parametros).subscribe({
      next: (respuesta: any) => {
        this.listaAsignacionDocente = respuesta.data
        this.cargandoAsignacion = false
      }
    })
  }

  /**
   * Metodo para crear el Form array
   * basado en la lista de docentes
   */
  crearFuncionarios(lista: any) {
    lista.forEach((docente: Docente) => {
      this.agregarElemento(docente)
    });
  }

  /**
   * Metodo para copiar la informacion.
   */
  copiarAsignacion() {
    if (this.copiandoRegistros) {
      return
    }
    const observables: any[] = [];
    const cedulasFuncionarios: number[] = []
    const noTieneSeleccionado = this.listaFuncionarios.controls.every((funcionario: any) => {
      return funcionario.get('seleccionado').value === false;
    });
    if (noTieneSeleccionado) {
      const modal = this.serviciosModal.open(ModalInformacionComponent, { size: 'md', backdrop: 'static', centered: true })
      modal.componentInstance.informacion = {
        error: false,
        esExitoso: 'warning',
        titulo: '¡Advertencia!',
        mensaje: 'No ha seleccionado ningún docente'
      }
    }
    else {
      this.copiandoRegistros = true;
      for (let i = 0; i < this.listaFuncionarios.controls.length; i++) {
        let tieneSeleccionado = this.listaFuncionarios.controls[i].get('seleccionado').value
        if (tieneSeleccionado) {
          let identificacion = parseInt(this.listaFuncionarios.controls[i].get('identificacion').value)
          cedulasFuncionarios.push(identificacion)
        }
      }
      const observables: any[] = [];
      cedulasFuncionarios.forEach((cedula: number) => {
        let asignacionesCopiadas = [];
        this.listaAsignacionDocente.forEach((asignacion: any) => {
          //console.log("Asingacion: ", asignacion, Number(asignacion.horasAsignadas));
          if (Number(asignacion.horasAsignadas) > 0) {
            asignacionesCopiadas.push({
              codJeraquico: asignacion.codJerarquico,
              identificacionDocente: cedula,
              codAsignatura: asignacion.codAsignatura,
              codGrupo: asignacion.codGrupo,
              vigencia: asignacion.vigencia,
              horasAsignadas: asignacion.horasAsignadas,
            });
          }
        })

        observables.push(this.asignacionAcademicaService.guardarAsignacionAcademica(asignacionesCopiadas));
      });

      forkJoin(observables).subscribe({
        next: (respuestas: any[]) => {
          this.errorEncontrado = false;
          for (const respuesta of respuestas) {
            if (respuesta.status != 200) {
              this.errorEncontrado = true;
              this.copiandoRegistros = false
            }
          }
          if (!this.errorEncontrado) {
            // Mostrar mensaje de éxito una vez que todas las solicitudes hayan terminado.
            const modalExito = this.serviciosModal.open(ModalInformacionComponent, { size: 'md', animation: false, backdrop: 'static', centered: true });
            modalExito.componentInstance.informacion = {
              error: false,
              esExitoso: 'done',
              titulo: '¡Éxito!',
              mensaje: 'Registros copiados exitosamente.'
            }
            this.copiandoRegistros = false
            this.activeModal.close(true)
          }
          else if(this.errorEncontrado){
            this.errorEncontrado =true;
            this.copiandoRegistros = false;
          }
        },
        error: (error) => {
          this.errorEncontrado =true;
            this.copiandoRegistros = false;
        },
        complete: () => {
          this.errorEncontrado =true;
           this.copiandoRegistros = false;
        }
      });
    }

  }


  /**
   * Metodo para cerrar el modal
   */

  cerrarModal() {
    this.activeModal.close()
  }

  /**
   * Eliminar el docente
   * recibido
   */
  ngOnDestroy(): void {
    this.docenteSeleccionado;
  }

}
