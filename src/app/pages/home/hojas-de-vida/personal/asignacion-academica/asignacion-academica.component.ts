import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsignacionesFuncionarioComponent } from './components/asignaciones-funcionario/asignaciones-funcionario.component';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { funcionario } from './interfaces/funcionario';
import { MensajeDescargarReporteComponent } from './components/mensaje-descargar-reporte/mensaje-descargar-reporte.component';
import { CopiarAsignacionAcademicaComponent } from './components/copiar-asignacion-academica/copiar-asignacion-academica.component';
import { AsignacionAcademicaService } from 'src/app/services/api/personal/asignacion-academica.service';
import { MensajeModal } from './components/mensaje-modal/mensaje-modal';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { AsignacionDocenteComponent } from 'src/app/components/asignacion-docente/asignacion-docente.component';

@Component({
  selector: 'app-asignacion-academica',
  templateUrl: './asignacion-academica.component.html',
  styleUrls: ['./asignacion-academica.component.scss']
})

export class AsignacionAcademicaComponent {

  @Input() tipoUsuario: string = 'funcionario';

  mostrarFiltros: boolean = true;
  asignacionAcademica: boolean = true;
  numero_identificacion: boolean = true;
  esAscendente: boolean = true
  allChecked: boolean = false;
  confirmarCheckboxSeleccionado!: boolean;
  siFuncionarioSeleccionado: boolean = false;
  habiliarCopiar: boolean = true;
  desHabilitarInfoHoras: boolean = true;
  arrayFuncionarios: any[] = [];


  cargandoRegistros: any;
  columnaOrden: string = 'primerNombre';
  formulario: any;
  funcionarioSeleccionado!: funcionario;

  totalPaginas!: number;
  totalResultados!: number;
  pagina: number = 0;
  pageSize: number = 10;

  public infoMensaje: any = {
    titulo: '',
    mensaje: '',
    emisor: ''
  }

  public infoAsignacionFuncionario: any = {
    numeroDocumento: '',
    funcionario: ''
  }

  ordenadaAscendente: any = {
    primerNombre: true,
    n: true
  };

  listadosFuncionarios: any[] = [

  ];


  parametrosFiltros: any = {
    sort: "primerapellido,asc",
    size: 10,
    page: 0
  }
  datos_usuario: AccesoPerfil;
  cargandoDocentes: boolean;
  ocultarBotones: boolean = false;
  horas: any[] = [];
  cargarHoras: boolean[] = [];
  actualizandoHoras: boolean;
  indiceActualActualizando: any;
  vigencias: any;
  deshabilitarInput: boolean;
  mensajeEnteros: boolean = false;

  toggleAll() {
    this.allChecked = !this.allChecked;
    this.listadosFuncionarios.forEach(element => element.checked = this.allChecked);
  }

  constructor(
    private servicioModal: NgbModal,
    private formBuilder: FormBuilder,
    private asignacionAcademicaService: AsignacionAcademicaService,
    private usuarioService: UsuarioService
  ) {
    this.datos_usuario = this.usuarioService.obtenerAccesoSeleccionado();

    this.construirFormulario();
    this.cargarVigencias()

  }

  construirFormulario() {

    this.formulario = this.formBuilder.group({
      infoHoras: this.formBuilder.array([null,[]]),
      // infoHoras: [],
      seleccionFuncionario: []
    });



  }

  enteroValidator(control) {
    // console.log(control)
    if (control.value && !Number.isInteger(control.value)) {
      return { decimalInvalido: true };
    }
    return null;
  }


  get listaHoras() {
    return this.formulario.get('infoHoras') as FormArray;
  }

  agregarHoras(horas: any = null) {
    this.listaHoras.push(this.formBuilder.control(horas, [Validators.max(99),this.enteroValidator]))
  }

  /**
 * Funcion que recibe la columna a ordenar
 * Basado en la opcion ordena ascendente o descendentemente
 * @param columna
 */
  ordenarDatos(columna: string) {
    for (let col in this.ordenadaAscendente) {
      if (col != columna) {
        this.ordenadaAscendente[col] = false
      }
      else {
        this.ordenadaAscendente[col] = !this.ordenadaAscendente[col]
        this.columnaOrden = columna
        this.esAscendente = !this.esAscendente;
        this.parametrosFiltros.sort = `${this.columnaOrden},${this.esAscendente ? 'primerapellido,asc' : 'primerapellido,desc'}`;
        this.obtenerDatos()
      }
    }
  }

  inputTodos(e: any) {
    if (e.target.checked) {
      this.toggleAll();
      this.ocultarBotones = true;
      this.confirmarCheckboxSeleccionado = true;
    } else {
      this.ocultarBotones = false;
      this.toggleAll();
      this.confirmarCheckboxSeleccionado = false;
    }
  }

  inputCheck(e: any, infoFuncionario: any, i: any) {

    const objetoFuncionario = {
      "institucion": Number(infoFuncionario.institucion),
      "sede": Number(infoFuncionario.sede),
      "jornada": Number(infoFuncionario.jornada),
      "metodologia": Number(this.parametrosFiltros.id_metodologia),
      "identifacion": Number(infoFuncionario.identificacion),
      "vigencia": Number(this.parametrosFiltros.id_vigencia)
    }


    this.funcionarioSeleccionado = infoFuncionario;
    // console.log(i)
    if (e) {
      this.ocultarBotones = true;
      this.confirmarCheckboxSeleccionado = true;
      this.arrayFuncionarios.push(objetoFuncionario)
      // console.log(this.arrayFuncionarios)
      if (this.arrayFuncionarios.length >= 0) {
        this.siFuncionarioSeleccionado = true
        this.habiliarCopiar = true;
      }
    } else {
      this.arrayFuncionarios.splice(i, 1);
      // console.log(this.arrayFuncionarios, i)
      this.ocultarBotones = false;
      this.confirmarCheckboxSeleccionado = false;
      this.siFuncionarioSeleccionado = false;
      this.habiliarCopiar = true;
    }

  }


  gestionarAsignacionAcademica(index: any, horasAsignadas) {

    let docente = this.listadosFuncionarios[index];

    if (this.listaHoras.value[index].horas <= 0) {
      this.infoMensaje.ventanaEnviado = true;
      this.infoMensaje.titulo = 'Funcionario sin horas asignadas';
      this.infoMensaje.mensaje = 'El funcionario seleccionado no tiene cargado un valor para el total de horas semanales. Por favor, indique un valor para el número de horas semanales que dictará el funcionario.';
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;

    } else {
      this.infoAsignacionFuncionario.filtros = this.parametrosFiltros
      this.infoAsignacionFuncionario.horasAsignadas = horasAsignadas
      this.infoAsignacionFuncionario.funcionario = `${docente.primerApellido} ${docente.segundoApellido} ${docente.primerNombre} ${docente.segundoNombre}
      `;
      this.infoAsignacionFuncionario.numeroDocumento = docente.identificacion;
      const modalRef = this.servicioModal.open(AsignacionesFuncionarioComponent, { size: 'md', centered: true, backdrop: 'static' });
      //console.log("Estos son los datos: ", this.infoAsignacionFuncionario);
      modalRef.componentInstance.infoAsignacionFuncionario = this.infoAsignacionFuncionario;
    }

  }

  cargarVigencias(): any {
    this.asignacionAcademicaService.obtenerVigencias().subscribe((resp: any) => {
      if (resp.status == 200) {
        this.vigencias = resp.data;
      }
    })
  }

  copiarRegistro() {
    // console.log(this.infoMensaje);
    let parametros = {
      institucion_id: this.datos_usuario.colegio.id,
      sede_id: this.parametrosFiltros.id_sede,
      jornada_id: this.parametrosFiltros.id_jornada,
      vigencia: this.parametrosFiltros.id_vigencia,
      metodologia_id: this.parametrosFiltros.id_metodologia,
    }
    this.infoMensaje.funcionarioSeleccionado = this.funcionarioSeleccionado;
    this.infoMensaje.listadosFuncionarios = this.listadosFuncionarios;
    this.infoMensaje.ventanaEnviado = true;
    const modalRef = this.servicioModal.open(CopiarAsignacionAcademicaComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.informacionDocente = this.infoMensaje.funcionarioSeleccionado;
    modalRef.componentInstance.parametrosUsuario = parametros;
    modalRef.result.then((result) => {
      this.obtenerDatos()
    })

  }

  eliminarRegistro() {

    // this.listadosFuncionarios.forEach((element: any) => {
    //   //console.log(element)
    // })

    if (!this.confirmarCheckboxSeleccionado) {

      this.infoMensaje.titulo = 'Error al eliminar registro';
      this.infoMensaje.mensaje = 'Debe seleccionar al menos un registro a eliminar';
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      this.infoMensaje.botonesAsignacionEliminar = false;
      this.infoMensaje.ventanaEnviado = true;
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;


    } else {

      if (this.siFuncionarioSeleccionado) {

        this.infoMensaje.titulo = 'Confirmación de eliminación de registros';
        this.infoMensaje.mensaje = '¿Está seguro de eliminar los registros seleccionados?';
        this.infoMensaje.botonesAsignacionEliminar = true;
        this.infoMensaje.botonesAsignacionErrorEliminar = false;
        this.infoMensaje.arrayFuncionario = this.arrayFuncionarios;
        this.infoMensaje.eliminarFuncionario = true;
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = this.infoMensaje;
        modalRef.result.then((resultados) => {
          if (resultados == 'cerrado') {
            setTimeout(() => {
              this.listadosFuncionarios = [];
              this.obtenerDocentes();
            }, 1000)
          }
        })

      } else {

        this.infoMensaje.titulo = 'Error al eliminar registro';
        this.infoMensaje.mensaje = 'Uno o mas de los funcionarios seleccionados no tiene asignación académica cargada. Por favor valide la información e intente de nuevo.';
        this.infoMensaje.botonesAsignacionEliminar = false;
        this.infoMensaje.botonesAsignacionErrorEliminar = true;
        this.infoMensaje.ventanaEnviado = true;
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = this.infoMensaje;


      }

    }

  }

  exportarRegistro() {
    // console.log(this.listaHoras)
    if (!this.confirmarCheckboxSeleccionado) {

      this.infoMensaje.titulo = 'Error al exportar registro';
      this.infoMensaje.mensaje = 'Debe seleccionar al menos un registro a exportar';
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      this.infoMensaje.botonesAsignacionEliminar = false;
      this.infoMensaje.ventanaEnviado = true;
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;


    } else {
      this.parametrosFiltros.institucion = this.datos_usuario.colegio.id;
      this.infoMensaje.parametros = this.parametrosFiltros;
      this.infoMensaje.funcionarios = this.arrayFuncionarios;
      this.infoMensaje.idFuncionario = 'id';
      this.infoMensaje.exportePorinstitucion = false;
      this.infoMensaje.ventanaEnviado = true;
      const modalRef = this.servicioModal.open(MensajeDescargarReporteComponent, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;


    }
  }

  exportarRegistroInstitucion(){
      this.infoMensaje.idFuncionario = 'id';
      this.infoMensaje.ventanaEnviado = true;
      this.parametrosFiltros.institucion = this.datos_usuario.colegio.id;
      this.infoMensaje.parametros = this.parametrosFiltros
      this.infoMensaje.exportePorinstitucion = true;
      const modalRef = this.servicioModal.open(MensajeDescargarReporteComponent, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;
  }


  verDocente(funcionario: any, index) {
    // console.log(funcionario)
    let infoFuncionario: any = {}
    infoFuncionario.funcionario = funcionario;
    infoFuncionario.metodologia = this.parametrosFiltros.id_metodologia;
    infoFuncionario.vigencia = this.parametrosFiltros.id_vigencia;

    // infoFuncionario.h
    infoFuncionario.tipoVentanaModal = true;
    const modalRef = this.servicioModal.open(AsignacionDocenteComponent, { size: 'xl', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infoFuncionario = infoFuncionario;

  }

  filtrar(event: any) {

    if (event.limpiarListado) {
      this.listadosFuncionarios = [];
      return
    }

    this.cargandoDocentes = true;
    //console.log(event)
    // {id_vigencia: 3, id_sede: 2, id_jornada: 2, id_metodologia: 1} 


    this.parametrosFiltros.id_vigencia = event.id_vigencia;
    this.parametrosFiltros.id_sede = event.id_sede;
    this.parametrosFiltros.id_jornada = event.id_jornada;
    this.parametrosFiltros.id_metodologia = event.id_metodologia;

    this.listadosFuncionarios = [];

    if (this.parametrosFiltros.id_vigencia || this.parametrosFiltros.id_sede || this.parametrosFiltros.id_jornada || this.parametrosFiltros.id_metodologia) {
      this.obtenerDocentes();
    } else {
      this.listadosFuncionarios = [];
      this.cargandoDocentes = false;
      this.infoMensaje.titulo = '';
      this.infoMensaje.mensaje = 'Filtros vacios';
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      this.infoMensaje.botonesAsignacionEliminar = false;
      this.infoMensaje.ventanaEnviado = true;
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;
    }


  }

  obtenerDatos() {
    this.obtenerDocentes();
  }

  obtenerDocentes() {

    this.cargandoDocentes = true;

    const institucion_id = this.datos_usuario.colegio.id;
    const sede_id = this.parametrosFiltros.id_sede;
    const jornada_id = this.parametrosFiltros.id_jornada;
    this.asignacionAcademicaService.obtenerDocentes(institucion_id, sede_id, jornada_id, this.parametrosFiltros).subscribe(async (resp: any) => {

      //Reinicio
      this.formulario.get('infoHoras').controls = []

      // console.log(resp)
      if (resp.status == 200) {
        this.listadosFuncionarios = resp.data.content;

        this.totalPaginas = resp.data.totalPages;
        // console.log(resp)
        // console.log(this.listadosFuncionarios)

        let index = 0;
        let nuevaListaFuncionarios: any[] = [];

        this.listadosFuncionarios.forEach((funcionario: any) => {
          index = index + 1
          funcionario.indice = index;
          // console.log(index,funcionario)
          nuevaListaFuncionarios.push(funcionario)
          let EstructuraHorasAsignadas = {
            "horas": funcionario.horasAsignadas
          }
          this.agregarHoras(EstructuraHorasAsignadas)
        })

        this.listadosFuncionarios = nuevaListaFuncionarios;
        // console.log(nuevaListaFuncionarios)

        this.cargandoDocentes = false;
      } else if (resp.status == 207) {
        this.listadosFuncionarios = [];
        this.cargandoDocentes = false;
        this.infoMensaje.titulo = '';
        this.infoMensaje.mensaje = resp.message;
        this.infoMensaje.botonesAsignacionErrorEliminar = true;
        this.infoMensaje.botonesAsignacionEliminar = false;
        this.infoMensaje.ventanaEnviado = true;
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = this.infoMensaje;
      }
    })


    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    if (this.parametrosFiltros.id_vigencia < anioActual) {
      this.deshabilitarInput = true;
      const formArray = this.formulario.get('infoHoras') as FormArray;
      this.formulario.controls['infoHoras'].disable();

      formArray.controls.forEach((control, index) => {
        (this.formulario.get('infoHoras') as FormArray).at(index).disable();
        control.disable();
        console.log(control)
      });
      this.listaHoras.disable();
    } else {
      this.deshabilitarInput = false;
      this.formulario.controls['infoHoras'].enable();
    }


  }

  actualizarHorasAsignadas(e, funcionario, i) {
  

    if (Number(e.target.value) !== Math.floor(Number(e.target.value))) {
      this.indiceActualActualizando = i;
      this.mensajeEnteros = true;
      return 
    }

    this.mensajeEnteros = false;

    this.listaHoras.controls[i].patchValue({
      horas: e.target.value
    })

    this.actualizandoHoras = true;
    // Deshabilita el FormArray 'infoHoras'
    (this.formulario.get('infoHoras') as FormArray).disable();

    this.indiceActualActualizando = i;
    // console.log(funcionario)
    const horaDocente = e.target.value;
    if (horaDocente > 99) {
      this.actualizandoHoras = false;

      this.infoMensaje.titulo = ``;
      this.infoMensaje.mensaje = `El valor debe estar entre 1 y 99`;
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      this.infoMensaje.botonesAsignacionEliminar = false;
      // this.infoMensaje.ventanaEnviado = true;
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;

      (this.formulario.get('infoHoras') as FormArray).at(i).reset();
      (this.formulario.get('infoHoras') as FormArray).at(i).disable();
      (this.formulario.get('infoHoras') as FormArray).at(i).setValue(0);
      // this.formulario.get('infoHoras').reset();

    } else {

      let body = {
        dsjInstitucion: this.datos_usuario.colegio.id,
        dsjIdentificacion: Number(funcionario.identificacion),
        dsjSede: this.parametrosFiltros.id_sede,
        dsjJornada: this.parametrosFiltros.id_jornada,
        horas: Number(horaDocente)
      }
 
      // console.log(this.listaHoras.controls[i].status )
      if(this.listaHoras.controls[i].status != "INVALID"){
        this.asignacionAcademicaService.actualizarIntensidadHorario(body).subscribe((resp: any) => {
          // console.log(resp)
          if (resp.status == 200) {
            this.actualizandoHoras = false;
            setTimeout(() => {
              this.formulario.controls['infoHoras'].enable();
              this.servicioModal.dismissAll();
            }, 3000)
          }
        })
      }


    }

    setTimeout(() => {
      this.servicioModal.dismissAll();
    }, 3000)


  }

  /**
 * Funcion que recibe el numero de pagina
 * y consulta los registros
 * @param valor
 */
  cambiarPagina(valor?: string) {

    this.allChecked = false;
    this.listadosFuncionarios = [];
    
    if (valor === 'siguiente') {
      if (this.pagina < this.totalPaginas - 1) {
        this.pagina = this.pagina + 1
        this.parametrosFiltros.page = this.pagina
        this.obtenerDatos()
      }
    }
    else if (this.pagina > 0) {
      this.pagina = this.pagina - 1;
      this.parametrosFiltros.page = this.pagina
      this.obtenerDatos()
    }
  }


  /**
   * Metodo que ordena la columna del indique acorde a los
   * datos visualizados en pantalla
   */
  ordenarColumna(columna: string) {
    this.ordenadaAscendente = Object.keys(this.ordenadaAscendente).reduce((acc, col) => {
        acc[col] = col === columna ? !this.ordenadaAscendente[col] : false;
        return acc;
    }, {} as { [key: string]: boolean });

    this.columnaOrden = columna;

    this.listadosFuncionarios.sort((a: any, b: any) => {
        const comparison = this.ordenadaAscendente[columna] ? 1 : -1;
        return a.indice > b.indice ? comparison : -comparison;
    });
}



}
