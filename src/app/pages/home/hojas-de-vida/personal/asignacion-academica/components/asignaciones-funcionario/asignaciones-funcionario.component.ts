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

  cargandoIntensidad: boolean = false;
  allChecked: boolean = false;
  errorHorasAsignadas: boolean = false;
  errorHorarioAsignado: boolean = false;
  desHabilitarGuardar: boolean = false;
  guardandoMensaje: boolean;
  indiceActualActualizando: any;
  mensajeEnteros: boolean = false;
  numeroConDecimales: boolean;
  ocultarBotones: boolean;

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

  get isDisabled(): boolean {
    return true; // Coloca aquí tu lógica real
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
    // console.log("Asingacion: ", this.infoAsignacionFuncionario);
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
          this.infoMensaje.mostrarAceptar = true;
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
      grados: this.formBuilder.array([]),
      checked: [false, []]
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
      grupos: this.formBuilder.array([]),
      checked: [false, []]
    });
  }

  nuevoGrupo(grupo: any = null) {
    let gradoId = "";
    let graduNombre = "";
    let horasAsignadas = 0;
    // console.log(grupo.horasAsignadas)
    if (grupo) {
      gradoId = grupo.codGrupo;
      graduNombre = grupo.nombreGrupo;
      horasAsignadas = (grupo.horasAsignadas > 0) ? grupo.horasAsignadas : 0;
    }
    return this.formBuilder.group({
      id: [gradoId, [Validators.required]],
      nombre: [graduNombre, [Validators.required]],
      cantidad: [horasAsignadas, [Validators.required]],
      checked: [!!Number(grupo.horasAsignadas), []],
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
      // asignatura.get('checked').disable();
      if (horasAsignatura > 0) {
        asignatura.get('checked').setValue(true);
      }

    });
  }

  calcularHorasAsignadas() {
    let horasAsignadas = 0;
    this.listaAsignaturas.controls.forEach((asignatura: any) => {
      horasAsignadas += Number(asignatura.get('cantidad').value);
    });

    // console.log(this.infoAsignacionFuncionario.horasAsignadas.horas,horasAsignadas)
    let diferenciaEntreHoras = this.infoAsignacionFuncionario.horasAsignadas - horasAsignadas;
    this.formAsignacion.get('horas_asignadas').setValue(diferenciaEntreHoras);
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
      // grado.get('checked').disable();
      if (horasGrado > 0) {
        grado.get('checked').setValue(true);
      }
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
    let cantidad = this.listaGrupos(asignaturaIndex, gradoIndex).at(grupoIndex).get('cantidad').value;
    this.listaGrupos(asignaturaIndex, gradoIndex).at(grupoIndex).get('checked').setValue(cantidad>0?true:false);
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
    this.listaGrados(asignaturaIndex).at(gradoIndex).get('checked').setValue(cantidadGrado>0?true:false);
  }

  recalcularAsignatura(asignaturaIndex: number) {
    console.log(asignaturaIndex)
    let cantidadAsignatura = 0;
    this.listaGrados(asignaturaIndex).controls.forEach((cantidadGrado: any) => {
      cantidadAsignatura += Number(cantidadGrado.get('cantidad').value);
    })
    this.listaAsignaturas.at(asignaturaIndex).get('cantidad').setValue(cantidadAsignatura);
    this.listaAsignaturas.at(asignaturaIndex).get('checked').setValue(cantidadAsignatura>0?true:false);
  }

  cerrarModal() {
    this.infoMensaje.titulo = 'Si cierra la ventana los cambios efectuados no se guardarán';
    this.infoMensaje.mensaje = '¿Desea continuar?';
    this.infoMensaje.cerrarAviso = true
    this.infoMensaje.botonesAsignacionFuncionarioConfirmarC = true;
    const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infoMensaje = this.infoMensaje;
    modalRef.result.then((resultados) => {
      // console.log(resultados)
      if (resultados == 'cerrado') { }
      if (modalRef) {
        modalRef.close();
      }
    })
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

    // console.log(Number(horasAsignadas) !== Math.floor(Number(horasAsignadas)))
    // console.log(horasAsignadas)
    if (Number(horasAsignadas) !== Math.floor(Number(horasAsignadas))) {
      this.numeroConDecimales = true;
      this.desHabilitarGuardar = true;
      return
    } else {
      this.desHabilitarGuardar = false;
      this.numeroConDecimales = false;
    }
    // console.log(Number(this.infoAsignacionFuncionario.horasAsignadas.horas), Number(horasAsignadas))
    if (horasAsignadas < 0) {

      this.errorHorarioAsignado = true;
      this.desHabilitarGuardar = true;

    } else {
      this.desHabilitarGuardar = false;
      this.errorHorarioAsignado = false;

      if (horasAsignadas > 99) {
        this.formAsignacion.get('horas_asignadas').reset()
        this.errorHorasAsignadas = true;
      } else {
        this.errorHorasAsignadas = false;
      }
    };

  }

  inputTodosAsignaturas(e: any, asignaturaIndex?: any, gradoIndex?: any, grupoIndex?: any) {

    // console.log(this.formAsignacion)
    if (Number(e) > 0 && this.formAsignacion.get('horas_asignadas').value > 0) {
      // Si se marca la casilla, selecciona todas las casillas
      this.seleccionarTodasLasAsignaturas(asignaturaIndex, gradoIndex);
    } else {
      // Si se desmarca la casilla, deselecciona todas las casillas
      this.deseleccionarTodasLasAsignaturas(asignaturaIndex, gradoIndex);
    }
  }

  seleccionarTodasLasAsignaturas(asignaturaIndex, gradoIndex) {

    // const asignaturasFormArray = this.formAsignacion.get('asignaturas') as FormArray;
    this.listaAsignaturas.controls[asignaturaIndex].patchValue({
      checked: true
    });

    const gruposFormArray: any = this.listaGrados(asignaturaIndex).at(gradoIndex).get('grupos');
    gruposFormArray.controls.forEach(element => {
      // console.log(element)
      if (element.value.cantidad > 0) {
        element.patchValue({
          checked: true
        })
      }
    });

    const gradosFormArray: any = this.listaAsignaturas.at(asignaturaIndex).get('grados');
    gradosFormArray.controls.forEach(element => {

      if (element.value.cantidad > 0) {
        element.patchValue({
          checked: true
        })
      }

    });

  }

  deseleccionarTodasLasAsignaturas(asignaturaIndex, gradoIndex) {


    let arrayCantidad: any[] = [];
    // console.log(asignaturaIndex, gradoIndex)
    const gruposFormArray = this.listaGrados(asignaturaIndex).at(gradoIndex).get('grupos') as FormArray;

    gruposFormArray.controls.forEach(grupoControl => {
      const cantidad = grupoControl.value.cantidad;

      arrayCantidad.push(grupoControl.value.cantidad);
      console.log(arrayCantidad)

      const todosCerosONulos = arrayCantidad.every(valor => valor === 0 || valor === null);
      
      console.log(todosCerosONulos)

      
      if (todosCerosONulos) {
        this.listaAsignaturas.controls[asignaturaIndex].get('checked').setValue(false);

        const gradosFormArray = this.listaAsignaturas.at(asignaturaIndex).get('grados') as FormArray;
        gradosFormArray.controls.forEach(gradoControl => {
          gradoControl.get('checked').setValue(false);
        });

      }

      grupoControl.get('checked').setValue(false);
    });

  }



  toggleAll() {
    this.allChecked = !this.allChecked;
    // this.listadosFuncionarios.forEach(element => element.checked = this.allChecked);
  }

  guardar() {
    this.guardandoMensaje = true;

    let horasAsignadas = this.formAsignacion.get('horas_asignadas').value;
    if (horasAsignadas < 0) {
      this.desHabilitarGuardar = true;
      this.guardandoMensaje = false;
      // return
    } else {
      this.desHabilitarGuardar = false;
      let asignaciones: any = this.obtenerAsignaciones();

      const asignacionesModificado = asignaciones.map(asignacion => ({
        ...asignacion,
        horasAsignadas: asignacion.horasAsignadas === null ? 0 : asignacion.horasAsignadas
      }));
      // console.log(asignacionesModificado)
      // console.log(asignaciones)
      if (asignacionesModificado) {
        this.asignacionAcademicaService.guardarAsignacionAcademica(asignacionesModificado).subscribe((resp: any) => {
          // console.log("Asingaciones a guardar: ", asignacionesModificado)
          console.log(resp)
          if (resp.status == 200) {
            this.guardandoMensaje = false;
            this.infoMensaje.ventanaEnviado = true;
            this.infoMensaje.cerradoTemporizador = true;
            this.infoMensaje.cerrarAviso = false;
            this.infoMensaje.titulo = '';
            this.infoMensaje.mensaje = resp.data;
            this.infoMensaje.botonesAsignacionErrorEliminar = true;
            const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
            modalRef.componentInstance.infoMensaje = this.infoMensaje;
          } else {
            this.guardandoMensaje = false;
            this.infoMensaje.cerrarAviso = false;
            this.infoMensaje.ventanaEnviado = true;
            this.infoMensaje.cerradoTemporizador = true;
            this.infoMensaje.titulo = '';
            this.infoMensaje.mensaje = resp.data;
            this.infoMensaje.botonesAsignacionErrorEliminar = true;
            const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
            modalRef.componentInstance.infoMensaje = this.infoMensaje;
          }
        })
      } else {
        this.guardandoMensaje = false;
      }
    }
  }

  cerrarAviso() {
    this.errorHorarioAsignado = false;
  }

}
