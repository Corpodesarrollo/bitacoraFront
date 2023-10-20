import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsignacionesFuncionarioComponent } from './components/asignaciones-funcionario/asignaciones-funcionario.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { VerAsignacionAcademicaComponent } from './components/ver-asignacion-academica/ver-asignacion-academica.component';
import { funcionario } from './interfaces/funcionario';
import { Docente } from './interfaces/docente';
import { MensajeDescargarReporteComponent } from './components/mensaje-descargar-reporte/mensaje-descargar-reporte.component';
import { CopiarAsignacionAcademicaComponent } from './components/copiar-asignacion-academica/copiar-asignacion-academica.component';
import { AsignacionAcademicaService } from 'src/app/services/api/personal/asignacion-academica.service';
import { MensajeModal } from './components/mensaje-modal/mensaje-modal';

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

  cargandoRegistros: any;
  columnaOrden: string = 'primerNombre';
  formulario: FormGroup;
  funcionarioSeleccionado!: funcionario;

  totalPaginas!: number;
  totalResultados!: number;
  pagina: number = 0;
  pageSize: number = 10;
  totalHorasAsignadasDocente: number = 35;
  


  public infoMensaje: any = {
    titulo: '',
    mensaje: '',
    emisor: ''
  }

  public infoAsignacionFuncionario = {
    numeroDocumento: '',
    funcionario: ''
  }

  ordenadaAscendente: any = {
    primerNombre: true,
    n:true
  };

  listadosFuncionarios: any[] = [

  ];

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

  parametrosFiltros:any = {
    sort: "primernombre,desc",
    size: 10,
    page: 0
  }
  datos_usuario: any;
  cargandoDocentes: boolean;



  toggleAll() {
    this.allChecked = !this.allChecked;
    this.listadosFuncionarios.forEach(element => element.checked = this.allChecked);
  }

  constructor(
    private servicioModal: NgbModal,
    private formBuilder: FormBuilder,
    private asignacionAcademicaService: AsignacionAcademicaService
  ) {
    this.datos_usuario  = JSON.parse(sessionStorage.getItem('sap_sec_percol')!)
    this.construirFormulario();
    this.obtenerDocentes();
  }


  construirFormulario() {

    this.formulario = this.formBuilder.group({
      // infoHoras: this.formBuilder.array([
      //   this.formBuilder.control(0,[])
      // ]),
      infoHoras: [],
      seleccionFuncionario: []
    });
  }


  // get listaHoras(){
  //   return this.formulario.get('infoHoras') as FormArray;
  // }


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
        this.parametrosFiltros.sort = `${this.columnaOrden},${this.esAscendente ? 'primernombre,asc' : 'primernombre,desc'}`;
        this.obtenerDatos()
      }
    }
  }

  inputTodos(e: any) {
    if (e.target.checked) {
      this.toggleAll();
      this.confirmarCheckboxSeleccionado = true;
    } else {
      this.toggleAll();
      this.confirmarCheckboxSeleccionado = false;
    }
  }

  inputCheck(e: any, infoFuncionario: any) {

    console.log(infoFuncionario)

    this.funcionarioSeleccionado = infoFuncionario;

    if (e.target.checked) {
      this.confirmarCheckboxSeleccionado = true;
      if (infoFuncionario.funcionario && infoFuncionario.horas && infoFuncionario.id && infoFuncionario.checked) {
        this.siFuncionarioSeleccionado = true
        this.habiliarCopiar = false;
      }
    } else {
      this.confirmarCheckboxSeleccionado = false;
      this.siFuncionarioSeleccionado = false;
      this.habiliarCopiar = true;
    }
  }


  gestionarAsignacionAcademica(index: any) {

    let docente = this.listadoDocentes[index];
    console.log(docente);

    if (!index) {
      this.infoMensaje.ventanaEnviado = true;
      this.infoMensaje.titulo = 'Funcionario sin horas asignadas';
      this.infoMensaje.mensaje = 'El funcionario seleccionado no tiene cargado un valor para el total de horas semanales. Por favor, indique un valor para el número de horas semanales que dictará el funcionario.';
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;
      // modalRef.result.then(() => {
      //   console.log('cerrado modal');
      // })
    } else {
      this.infoAsignacionFuncionario.funcionario = `${docente.apellidoNombre}`;
      this.infoAsignacionFuncionario.numeroDocumento = '52013697';
      const modalRef = this.servicioModal.open(AsignacionesFuncionarioComponent, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoAsignacionFuncionario = this.infoAsignacionFuncionario;
      // modalRef.result.then(() => {
      //   console.log('cerrado modal');
      // });
    }

  }

  copiarRegistro() {
    //console.log(this.habiliarCopiar)

    this.infoMensaje.funcionarioSeleccionado = this.funcionarioSeleccionado;
    this.infoMensaje.listadosFuncionarios = this.listadosFuncionarios;
    this.infoMensaje.ventanaEnviado = true;
    const modalRef = this.servicioModal.open(CopiarAsignacionAcademicaComponent, { size: 'md', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infoMensaje = this.infoMensaje;
    modalRef.result.then(() => {
     // console.log('cerrado modal');
    });

  }

  eliminarRegistro() {

    this.listadosFuncionarios.forEach((element: any) => {
      //console.log(element)
    })

    if (!this.confirmarCheckboxSeleccionado) {

      this.infoMensaje.titulo = 'Error al eliminar registro';
      this.infoMensaje.mensaje = 'Debe seleccionar al menos un registro a eliminar';
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      this.infoMensaje.botonesAsignacionEliminar = false;
      this.infoMensaje.ventanaEnviado = true;
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;
      modalRef.result.then(() => {
        //console.log('cerrado modal');
      });

    } else {

      if (this.siFuncionarioSeleccionado) {

        this.infoMensaje.titulo = 'Confirmación de eliminación de registros';
        this.infoMensaje.mensaje = '¿Está seguro de eliminar los registros seleccionados?';
        this.infoMensaje.botonesAsignacionEliminar = true;
        this.infoMensaje.botonesAsignacionErrorEliminar = false;
        this.infoMensaje.ventanaEnviado = true;
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = this.infoMensaje;
        modalRef.result.then(() => {
          //console.log('cerrado modal');
        });

      } else {

        this.infoMensaje.titulo = 'Error al eliminar registro';
        this.infoMensaje.mensaje = 'Uno o mas de los funcionarios seleccionados no tiene asignación académica cargada. Por favor valide la información e intente de nuevo.';
        this.infoMensaje.botonesAsignacionEliminar = false;
        this.infoMensaje.botonesAsignacionErrorEliminar = true;
        this.infoMensaje.ventanaEnviado = true;
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = this.infoMensaje;
        modalRef.result.then(() => {
          //console.log('cerrado modal');
        });

      }

    }

  }

  exportarRegistro() {
    console.log(this.formulario.value)
    if (!this.confirmarCheckboxSeleccionado) {

      this.infoMensaje.titulo = 'Error al exportar registro';
      this.infoMensaje.mensaje = 'Debe seleccionar al menos un registro a exportar';
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      this.infoMensaje.botonesAsignacionEliminar = false;
      this.infoMensaje.ventanaEnviado = true;
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;
      modalRef.result.then(() => {
        //console.log('cerrado modal');
      });

    } else {

      this.infoMensaje.idFuncionario = 'id';
      this.infoMensaje.ventanaEnviado = true;
      const modalRef = this.servicioModal.open(MensajeDescargarReporteComponent, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = this.infoMensaje;
      modalRef.result.then(() => {
        //console.log('cerrado modal');
      });


    }
  }

  verDocente(funcionario: any) {
    let infoFuncionario: any = {}
    infoFuncionario.tipoUsuario = 'docente';
    infoFuncionario.Funcionmodal = 'verDocente'
    infoFuncionario.id = funcionario.id;
    infoFuncionario.funcionario = funcionario.funcionario;
    infoFuncionario.ventanaEnviado = true;
    const modalRef = this.servicioModal.open(VerAsignacionAcademicaComponent, { size: 'xl', centered: true, backdrop: 'static' });
    modalRef.componentInstance.infoFuncionario = infoFuncionario;
    modalRef.result.then(() => {
      //console.log('cerrado modal');
    })
  }

  filtrar(event: any) {

    this.cargandoDocentes = true;
    //console.log(event)
    // {id_vigencia: 3, id_sede: 2, id_jornada: 2, id_metodologia: 1}

    this.parametrosFiltros.id_vigencia = event.id_vigencia;
    this.parametrosFiltros.id_sede = event.id_sede;
    this.parametrosFiltros.id_jornada = event.id_jornada;
    this.parametrosFiltros.id_metodologia = event.id_metodologia;

    this.listadosFuncionarios = [];
    this.obtenerDocentes();

  }

  obtenerDatos() {
    this.obtenerDocentes();
  }

  obtenerDocentes(){
    
    this.cargandoDocentes = true;

    const institucion_id = this.datos_usuario.colegio.idColegio;
    const cede_id = this.datos_usuario.sede.idSede;
    const jornada_id = this.datos_usuario.jornada.idJornada;
    this.asignacionAcademicaService.obtenerDocentes(institucion_id,cede_id,jornada_id,this.parametrosFiltros).subscribe((resp:any)=>{
      //console.log(resp)
      if(resp.status == 200){
        this.listadosFuncionarios = resp.data.content;
        this.totalPaginas = resp.data.totalPages;
        console.log(resp)
        this.cargandoDocentes = false;
      }
    })

  }

  /**
 * Funcion que recibe el numero de pagina
 * y consulta los registros
 * @param valor
 */
  cambiarPagina(valor?: string) {

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
  ordenarColumna(columna:string){
    for( let col in this.ordenadaAscendente){
      if(col != columna){
        this.ordenadaAscendente[col] = false;
      }
      else{
        this.ordenadaAscendente[col] = !this.ordenadaAscendente[col];
        this.columnaOrden = columna
      }
    }

    function compare(a: any, b: any) {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    }
    console.log(this.ordenadaAscendente['n'])
    if (this.ordenadaAscendente['n']) {
      this.listadosFuncionarios.sort((a:any, b:any) => compare(b.indice, a.indice));
    } else {
      this.listadosFuncionarios.sort((a:any, b:any) => compare(a.indice, b.indice));
    }
  }



}
