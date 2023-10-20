import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajeErrorComponentComponent } from './components/mensaje-error-component/mensaje-error-component.component';
import { AsignacionesFuncionarioComponent } from './components/asignaciones-funcionario/asignaciones-funcionario.component';
import { FormBuilder } from '@angular/forms';
import { VerAsignacionAcademicaComponent } from './components/ver-asignacion-academica/ver-asignacion-academica.component';
import { funcionario } from '../interfaces/funcionario';
import { Docente } from '../interfaces/docente';

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
  esAscendente:boolean = true
  allChecked: boolean = false;
  confirmarElimarRegistro!: boolean;
 
  cargandoRegistros: any;
  columnaOrden:string = 'primerNombre';
  formulario: any;
  
  
  totalPaginas!: number;
  totalResultados!: number;
  pagina: number = 0;
  pageSize:number = 10;
  totalHorasAsignadasDocente:number = 35;


  parametrosPagina = {
    pagina: this.pagina,
    size: this.pageSize,
    sort: 'primerNombre,asc'
  }

  public infoMensaje:any = {
    titulo: '',
    mensaje: '',
    emisor:''
  }

  public infoAsignacionFuncionario = {
    numeroDocumento: '',
    funcionario:''  
  }

  ordenadaAscendente:any = {
    tipoIdentificacion: false,
    identificacion: false,
    cargo: false,
    primerApellido: false,
    primerNombre: true,
  };

  listadosFuncionarios: funcionario[] = [
    { 'id': '1', 'funcionario': 'Juliana Marcela Raul Gonzalez', 'horas': '', 'checked': false },
    { 'id': '2', 'funcionario': 'David García Sánchez', 'horas': '30', 'checked': false },
    { 'id': '3', 'funcionario': 'Fernanda Rodríguez Vargas', 'horas': '27', 'checked': false },
    { 'id': '4', 'funcionario': 'María Torres Ramírez', 'horas': '32', 'checked': false },
    { 'id': '5', 'funcionario': 'Patricia Silva Sánchez', 'horas': '19', 'checked': false },
    { 'id': '6', 'funcionario': 'Acuña Fuentes Laura Alejandra', 'horas': '35', 'checked': false },
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
  



  toggleAll() {
    this.allChecked = !this.allChecked;
    this.listadosFuncionarios.forEach(element => element.checked = this.allChecked);
  }

  constructor(
    private servicioModal: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this. construirFormulario();
  }


  construirFormulario(){
    
    this.formulario = this.formBuilder.group({
      infoHoras: [''],
      seleccionFuncionario:[]
    });
  }

  
    /**
   * Funcion que recibe la columna a ordenar
   * Basado en la opcion ordena ascendente o descendentemente
   * @param columna
   */
    ordenarDatos(columna:string){
      for( let col in this.ordenadaAscendente){
        if(col != columna){
          this.ordenadaAscendente[col] = false
        }
        else{
          this.ordenadaAscendente[col] = !this.ordenadaAscendente[col]
          this.columnaOrden = columna
          this.esAscendente = !this.esAscendente;
          this.parametrosPagina.sort = `${this.columnaOrden},${this.esAscendente ? 'asc' : 'desc'}`;
          this.obtenerDatos()
        }
      }
    }

  inputTodos(e: any) {
    if (e.target.checked) {
      this.toggleAll();
      this.confirmarElimarRegistro = true;
    } else {
      this.toggleAll();
      this.confirmarElimarRegistro = false;
    }
    console.log(this.confirmarElimarRegistro)
  }

  inputCheck(e:any){
    if (e.target.checked) {
      this.confirmarElimarRegistro = true;
    }  else {
      this.confirmarElimarRegistro = false;
    }
    console.log(this.confirmarElimarRegistro)
  }


  gestionarAsignacionAcademica(infoFuncionario:funcionario){
    if(!infoFuncionario.horas){
       this.infoMensaje.titulo = 'Funcionario sin horas asignadas';
       this.infoMensaje.mensaje = 'El funcionario seleccionado no tiene cargado un valor para el total de horas semanales. Por favor, indique un valor para el número de horas semanales que dictará el funcionario.';
       const modalRef =  this.servicioModal.open(MensajeErrorComponentComponent , { size: 'md', centered: true, backdrop: 'static'});
       modalRef.componentInstance.infoMensaje = this.infoMensaje;
       modalRef.result.then(() => {
         console.log('cerrado modal');
        })
    }else{
      this.infoAsignacionFuncionario.funcionario = infoFuncionario.funcionario;
      this.infoAsignacionFuncionario.numeroDocumento = '52013697';
      const modalRef =  this.servicioModal.open(AsignacionesFuncionarioComponent , { size: 'md', centered: true, backdrop: 'static'});
      modalRef.componentInstance.infoAsignacionFuncionario = this.infoAsignacionFuncionario;
      modalRef.result.then(() => {
        console.log('cerrado modal');
       })
    }
      
  }

  eliminarRegistro(){
    if(!this.confirmarElimarRegistro){
      this.infoMensaje.titulo = 'Error al eliminar registro';
      this.infoMensaje.mensaje = 'Debe seleccionar al menos un registro a eliminar';
      this.infoMensaje.botonesAsignacionErrorEliminar = true;
      this.infoMensaje.botonesAsignacionEliminar = false;
      const modalRef =  this.servicioModal.open(MensajeErrorComponentComponent , { size: 'md', centered: true, backdrop: 'static'});
      modalRef.componentInstance.infoMensaje = this.infoMensaje;
      modalRef.result.then(() => {
        console.log('cerrado modal');
       })
    } else{
      this.infoMensaje.titulo = 'Confirmación de eliminación de registros';
      this.infoMensaje.mensaje = '¿Está seguro de eliminar los registros seleccionados?';
      this.infoMensaje.botonesAsignacionEliminar = true;
      this.infoMensaje.botonesAsignacionErrorEliminar = false;
      const modalRef =  this.servicioModal.open(MensajeErrorComponentComponent , { size: 'md', centered: true, backdrop: 'static'});
      modalRef.componentInstance.infoMensaje = this.infoMensaje;
      modalRef.result.then(() => {
        console.log('cerrado modal');
       })
    }
   }

  verDocente(funcionario:any){
    let infoFuncionario:any = {}
    infoFuncionario.tipoUsuario = 'docente';
    infoFuncionario.Funcionmodal = 'verDocente'
    infoFuncionario.id = funcionario.id;
    infoFuncionario.funcionario = funcionario.funcionario;
    const modalRef =  this.servicioModal.open(VerAsignacionAcademicaComponent , { size: 'xl', centered: true, backdrop: 'static'});
    modalRef.componentInstance.infoFuncionario = infoFuncionario;
    modalRef.result.then(() => {
      console.log('cerrado modal');
     })
  }

  filtrar(event: any) { }

  obtenerDatos(){

  } 

  /**
 * Funcion que recibe el numero de pagina
 * y consulta los registros
 * @param valor
 */
  cambiarPagina(valor?: string) {
    if (valor === 'siguiente') {
      if (this.pagina < this.totalPaginas - 1) {
        this.pagina = this.pagina + 1
        // this.parametrosPagina.pagina = this.pagina
        // this.obtenerDatos()
      }
    }
    else if (this.pagina > 0) {
      this.pagina = this.pagina - 1;
      // this.parametrosPagina.pagina = this.pagina
      // this.obtenerDatos()
    }
  }


}
