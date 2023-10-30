import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsignacionAcademicaService } from 'src/app/services/api/personal/asignacion-academica.service';
import { Asignacion } from 'src/app/interfaces/asignacion.interface';
import { MensajeModal } from '../mensaje-modal/mensaje-modal';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-asignaciones-funcionario',
  templateUrl: './asignaciones-funcionario.component.html',
  styleUrls: ['./asignaciones-funcionario.component.scss']
})
export class AsignacionesFuncionarioComponent implements OnInit {

  @Input() infoAsignacionFuncionario: any;

  formAsignacion!: FormGroup;
  cargandoIntensidad: boolean = false;

  estructuraAcademica: any = [];

  servicioModal = inject(NgbModal);
  formBuilder = inject(FormBuilder);
  asignacionAcademicaService = inject(AsignacionAcademicaService);
  serviciosUsuario = inject(UsuarioService);

  public infoMensaje: any = {
    titulo: '',
    mensaje: '',
    emisor: ''
  }
  errorHorasAsignadas: boolean = false;
  errorHorarioAsignado: boolean = false;
  desHabilitarGuardar: boolean = false;
  guardandoMensaje: boolean;
  indiceActualActualizando: any;
  mensajeEnteros: boolean = false;
  numeroConDecimales: boolean;

  ngOnInit() {
    this.construirFormulario();
    this.formAsignacion.controls['horas_asignadas'].disable();
    this.obtenerIntensidadHoraria();
  }

  construirFormulario() {
    this.formAsignacion = this.formBuilder.group({
      asignaturas: this.formBuilder.array([]),
      horas_asignadas: [0, [Validators.max(99)]]
    });
  }

  get listaAsignaturas() {
    return this.formAsignacion.get('asignaturas') as FormArray;
  }

  listaGrados(asignaturaIndex: number) {
    return this.listaAsignaturas.at(asignaturaIndex).get('grados') as FormArray;
  }

  listaGrupos(asignaturaIndex: number, gradoIndex: number) {
    return this.listaGrados(asignaturaIndex).at(gradoIndex).get('grupos') as FormArray;
  }

  async obtenerIntensidadHoraria() {
    this.cargandoIntensidad = true;
    let datosUsuario = this.serviciosUsuario.obtenerAccesoSeleccionado();
    //console.log("Asingacion: ", this.infoAsignacionFuncionario);
    let parametros = {
      institucion_id: datosUsuario.colegio?.id,
      metodologia_id: this.infoAsignacionFuncionario.filtros.id_metodologia,
      vigencia: this.infoAsignacionFuncionario.filtros.id_vigencia,
      sede_id: this.infoAsignacionFuncionario.filtros.id_sede,
      jornada_id: this.infoAsignacionFuncionario.filtros.id_jornada,
      documento_docente: this.infoAsignacionFuncionario.numeroDocumento
    }
    this.asignacionAcademicaService.obtenerintensidadHoraria(parametros).subscribe({
      next: (respuesta: any) => {
        if (respuesta.status == "200") {
          this.estructuraAcademica = respuesta.data;
          this.cargandoIntensidad = false;
          this.cargarAsignaturas();
          this.validarHorasAsignadas()
        } else {
          this.infoMensaje.ventanaEnviado = true;
          this.infoMensaje.titulo = '';
          this.infoMensaje.mensaje = respuesta.message;
          this.infoMensaje.botonesAsignacionErrorEliminar = true;
          const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
          modalRef.componentInstance.infoMensaje = this.infoMensaje;
        }
      },
      error: (error: any) => {
        console.error("Hubo un error al recuperar la intensidad horaria: ", error);
      }
    });
  }

  cargarAsignaturas() {
    this.estructuraAcademica.forEach((asignacion: any) => {
      this.agregarAsignatura(asignacion);
    });
    this.calcularHorasAsignaturas();
    this.calcularHorasAsignadas();
  }

  agregarAsignatura(asignatura: any = null) {
    if (!this.asignaturaRepetida(asignatura.codAsignatura)) {
      this.listaAsignaturas.push(this.nuevaAsignatura(asignatura));
    }
  }

  agregarGrado(grado: any = null, asignaturaIndex: number) {
    if (!this.gradoRepetido(grado.codGrado, asignaturaIndex)) {
      let asignaturaId = this.listaAsignaturas.at(asignaturaIndex).get('id')?.value;
      if (asignaturaId) {
        this.listaGrados(asignaturaIndex).push(this.nuevoGrado(grado));
      }
    }
  }

  agregarGrupo(asignacion, asignaturaIndex, gradoIndex) {
    if (!this.grupoReperido(asignacion.nombreGrupo, asignaturaIndex, gradoIndex)) {
      let asignaturaId = this.listaGrados(asignaturaIndex).at(gradoIndex).get('id')?.value;
      if (asignaturaId) {
        this.listaGrupos(asignaturaIndex, gradoIndex).push(this.nuevoGrupo(asignacion));
      }
    }
  }

  nuevaAsignatura(asignatura: any = null, asignaturaIndex: any = null) {
    let asignaturaId = "";
    let asignaturaNombre = "";
    let asignaturaCantidad = 0;
    let identificacionDocente = "";
    let vigencia = "";
    console.log(asignatura)
    if (asignatura) {
      asignaturaId = asignatura.codAsignatura;
      asignaturaNombre = asignatura.nombreAsignatura;
      identificacionDocente = this.infoAsignacionFuncionario.numeroDocumento;
      vigencia = asignatura.vigencia;
    }
    return this.formBuilder.group({
      id: [asignaturaId, [Validators.required]],
      nombre: [asignaturaNombre, [Validators.required]],
      identificacion_docente: [identificacionDocente, [Validators.required]],
      vigencia: [vigencia, [Validators.required]],
      cantidad: [asignaturaCantidad, [Validators.required]],
      grados: this.formBuilder.array([])
    });
  }

  nuevoGrado(grado: any = null) {
    let gradoId = "";
    let gradoNombre = "";
    let codigoJerarquico = "";
    let gradoCantidad = 0;
    if (grado) {
      gradoId = grado.codGrado;
      gradoNombre = grado.nombreGrado;
      codigoJerarquico = grado.codJerarquico;
    }
    return this.formBuilder.group({
      id: [gradoId, [Validators.required]],
      nombre: [gradoNombre, [Validators.required]],
      codigo_jerarquico: [codigoJerarquico, [Validators.required]],
      cantidad: [gradoCantidad, [Validators.required]],
      grupos: this.formBuilder.array([])
    });
  }

  nuevoGrupo(grupo: any = null) {
    let gradoId = "";
    let graduNombre = "";
    let horasAsignadas = 0;
    if (grupo) {
      gradoId = grupo.codGrupo;
      graduNombre = grupo.nombreGrupo;
      horasAsignadas = (grupo.horasAsignadas > 0) ? grupo.horasAsignadas : 0;
    }
    return this.formBuilder.group({
      id: [gradoId, [Validators.required]],
      nombre: [graduNombre, [Validators.required]],
      cantidad: [horasAsignadas, [Validators.required]],
    });
  }

  asignaturaRepetida(asignaturaId: number) {
    if (this.contarAsignaturaEnEstuctura(asignaturaId) > 0) {
      return true;
    } else {
      return false;
    }
  }

  gradoRepetido(gradoId: number, asignaturaIndex) {
    if (this.contarGradoEnAsignatura(gradoId, asignaturaIndex) > 0) {
      return true;
    } else {
      return false;
    }
  }

  grupoReperido(grupoId: number, asignaturaIndex, gradoIndex) {
    if (this.contarGrupoEnAsignatura(grupoId, asignaturaIndex, gradoIndex) > 0) {
      return true;
    } else {
      return false;
    }
  }

  contarAsignaturaEnEstuctura(asignaturaId: number) {
    let conteo = 0;
    this.listaAsignaturas.controls.forEach((asignatura: any) => {
      if (asignatura.controls.id.value == asignaturaId) {
        conteo++
      }
    });
    return conteo;
  }

  contarGradoEnAsignatura(gradoId: number, asignaturaIndex: number) {
    let conteo = 0;
    this.listaGrados(asignaturaIndex).controls.forEach((grado: any) => {
      if (grado.controls.id.value == gradoId) {
        conteo++
      }
    });
    return conteo;
  }

  contarGrupoEnAsignatura(grupoId, asignaturaIndex, gradoIndex) {
    let conteo = 0;
    this.listaGrupos(asignaturaIndex, gradoIndex).controls.forEach((grupo: any) => {
      // console.log(grupo)
      if (grupo.controls.nombre.value == grupoId) {
        conteo++
      }
    });
    return conteo;
  }

  calcularHorasAsignaturas() {
    this.listaAsignaturas.controls.forEach((asignatura: any) => {
      let asignturaId = asignatura.get('id')?.value;
      let horasAsignatura = 0;
      this.estructuraAcademica.forEach((asignacion: any) => {
        if (asignacion.codAsignatura == asignturaId) {
          horasAsignatura += Number(asignacion.horasAsignadas)
        }
      });
      asignatura.get('cantidad').setValue(horasAsignatura);
    });
  }

  calcularHorasAsignadas() {
    let horasAsignadas = 0;
    this.listaAsignaturas.controls.forEach((asignatura: any) => {
      horasAsignadas += Number(asignatura.get('cantidad').value);
    });
    this.formAsignacion.get('horas_asignadas').setValue(horasAsignadas);
  }

  calcularHorasGrados(asignaturaIndex: number) {
    const asignaturaId = this.listaAsignaturas.at(asignaturaIndex).get('id')?.value;
    this.listaGrados(asignaturaIndex).controls.forEach((grado: any) => {
      let gradoId = grado.get('id')?.value;
      let horasGrado = 0;
      this.estructuraAcademica.forEach((asignacion: any) => {
        if (asignacion.codGrado == gradoId && asignacion.codAsignatura == asignaturaId) {
          horasGrado += Number(asignacion.horasAsignadas)
        }
      });
      grado.get('cantidad').setValue(horasGrado);
    });
  }

  abrirAsignatura(asignaturaIndex) {
    const asignaturaId = this.listaAsignaturas.at(asignaturaIndex).get('id')?.value;
    this.estructuraAcademica.forEach((asignacion: any) => {
      if (asignacion.codAsignatura == asignaturaId)
        this.agregarGrado(asignacion, asignaturaIndex);
    });
    this.calcularHorasGrados(asignaturaIndex);
  }

  abrirGrado(asignaturaIndex: number, gradoIndex: number, asignatura, grado) {
    this.estructuraAcademica.forEach((asignacion: any) => {
      if (asignacion.nombreAsignatura == asignatura && grado == asignacion.nombreGrado) {
        // console.log(asignacion)
        this.agregarGrupo(asignacion, asignaturaIndex, gradoIndex);
      }
    });
  }

  calcularTotales(asignaturaIndex: number, gradoIndex: number, grupoIndex: number) {
    this.recalcularGrado(asignaturaIndex, gradoIndex);
    this.recalcularAsignatura(asignaturaIndex);
    this.calcularHorasAsignadas();
  }

  recalcularGrado(asignaturaIndex: number, gradoIndex: number) {
    let gruposControles = this.listaGrupos(asignaturaIndex, gradoIndex);
    let cantidadGrado = 0;
    gruposControles.controls.forEach((controlGrupo: any) => {
      cantidadGrado += Number(controlGrupo.get('cantidad').value);
    })
    this.listaGrados(asignaturaIndex).at(gradoIndex).get('cantidad').setValue(cantidadGrado);
  }

  recalcularAsignatura(asignaturaIndex: number) {
    let cantidadAsignatura = 0;
    this.listaGrados(asignaturaIndex).controls.forEach((cantidadGrado: any) => {
      cantidadAsignatura += Number(cantidadGrado.get('cantidad').value);
    })
    this.listaAsignaturas.at(asignaturaIndex).get('cantidad').setValue(cantidadAsignatura);
  }

  cerrarModal() {
    this.infoMensaje.titulo = 'Confirmación de cierre';
    this.infoMensaje.mensaje = '¿Está seguro de cerrar asignación académica?';
    this.infoMensaje.ventanaEnviado = true
    this.infoMensaje.botonesAsignacionFuncionarioConfirmarC = true;
    const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infoMensaje = this.infoMensaje;
  }

  obtenerAsignaciones() {
    let asignaciones: Asignacion[] = [];
    for (let a = 0; a < this.listaAsignaturas.controls.length; a++) {
      let asignacion: Asignacion;
      let asignatura = this.listaAsignaturas.controls[a];
      //console.log("Asignaturas: ", this.listaGrados(a).controls);
      for (let g = 0; g < this.listaGrados(a).controls.length; g++) {
        //console.log("Grado: ", this.listaGrados(a).controls[g]);
        let grado = this.listaGrados(a).controls[g];
        for (let gp = 0; gp < this.listaGrupos(a, g).controls.length; gp++) {
          let grupo = this.listaGrupos(a, g).controls[gp];
          asignacion = {
            codAsignatura: asignatura.get('id').value,
            codJeraquico: grado.get('codigo_jerarquico').value,
            codGrupo: grupo.get('id').value,
            vigencia: asignatura.get('vigencia').value,
            horasAsignadas: grupo.get('cantidad').value,
            identificacionDocente: asignatura.get('identificacion_docente').value
          }
          asignaciones.push(asignacion);
        }
      }
    };
    return asignaciones;
  }

  validarHorasAsignadas() {
    let horasAsignadas = this.formAsignacion.get('horas_asignadas').value;

    console.log(Number(horasAsignadas) !== Math.floor(Number(horasAsignadas)))
    if (Number(horasAsignadas) !== Math.floor(Number(horasAsignadas))) {
      this.numeroConDecimales = true; 
      this.desHabilitarGuardar = true;
      console.log(this.numeroConDecimales)
      return
    }else{
      this.desHabilitarGuardar = false;
      this.numeroConDecimales = false;
    }
    // console.log(Number(this.infoAsignacionFuncionario.horasAsignadas.horas), Number(horasAsignadas))
    if (Number(this.infoAsignacionFuncionario.horasAsignadas.horas) < Number(horasAsignadas)) {

      this.errorHorarioAsignado = true;
      this.desHabilitarGuardar = true;
  
    } else {
      this.desHabilitarGuardar = false;
      this.errorHorarioAsignado = false;

      if (horasAsignadas >= 99) {
        this.formAsignacion.get('horas_asignadas').reset()
        this.errorHorasAsignadas = true;
      } else {
        this.errorHorasAsignadas = false;
      }
    };

  }

  verificarValor(e,i){

  }

  guardar() {
    this.guardandoMensaje = true;

    let horasAsignadas = this.formAsignacion.get('horas_asignadas').value;
    if (Number(this.infoAsignacionFuncionario.horasAsignadas) < Number(horasAsignadas)) {
      this.desHabilitarGuardar = true;
      this.guardandoMensaje = false;
      // return
    } else {
      this.desHabilitarGuardar = false;
      let asignaciones = this.obtenerAsignaciones();
      // console.log("Asingaciones a guardar: ", asignaciones)
      if (asignaciones) {
        this.asignacionAcademicaService.guardarAsignacionAcademica(asignaciones).subscribe((resp: any) => {
          console.log(resp)
          if (resp.status == 200) {
            this.guardandoMensaje = false;
            this.infoMensaje.ventanaEnviado = true;
            this.infoMensaje.titulo = '';
            this.infoMensaje.mensaje = resp.data;
            this.infoMensaje.botonesAsignacionErrorEliminar = true;
            const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
            modalRef.componentInstance.infoMensaje = this.infoMensaje;
          } else {
            this.guardandoMensaje = false;
            this.infoMensaje.ventanaEnviado = true;
            this.infoMensaje.titulo = '';
            this.infoMensaje.mensaje = resp.data;
            this.infoMensaje.botonesAsignacionErrorEliminar = true;
            const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
            modalRef.componentInstance.infoMensaje = this.infoMensaje;
          }
        })
      }else{
        this.guardandoMensaje = false;
      }
    }

  }

}
