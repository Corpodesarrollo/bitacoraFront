import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditarDatosComponent } from '../editar-datos/editar-datos.component';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { HttpResponse } from '@angular/common/http';
import { DatosFuncionarios } from 'src/app/interfaces/datos_funcionarios.interface';

@Component({
  selector: 'app-anuario',
  templateUrl: './anuario.component.html',
  styleUrls: ['./anuario.component.scss']
})
export class AnuarioComponent {

  cargandoFotos:boolean = false
  cargandoRegistros:boolean = false;
  datosNoEncontrados:boolean = false;
  parametrosFiltros:any
  parametrosPagina:any
  totalResultados:any
  listaRegistrosAnuario:DatosFuncionarios[] = [];
  totalPaginas!:number;
  pagina:number = 0;
  pageSize:number = 8;

  modalService = inject(NgbModal);

  constructor(
    private personalService: PersonalService) { }


  /**
   * Carga los parametros
   * de la pagina para que resuelva por apellido
   */
  ngOnInit(){
    this.parametrosPagina = {
      sort: 'primerApellido,asc',
      size: this.totalResultados
    }
    this.obtenerDatosAnuario();
  }

  /**
   * meotod que obtiene las fotos
   * de los usuarios y las asigna al anuaria
   */
  obtenerDatosAnuario(){
    this.cargandoFotos = true
    this.personalService.obtenerDatosFiltrados(this.parametrosFiltros, this.parametrosPagina).subscribe({
      next: (respuesta: HttpResponse<any>) =>{
        if(respuesta.status === 200){
            const data = respuesta.body.data
            this.listaRegistrosAnuario = data.content.map((registro:any, index:any) =>{
              const indiceCalculado = index + 1 + this.pagina * this.pageSize;
              return{
                ...registro,
                indice: indiceCalculado,
                nombres: registro.primerNombre + " " + registro.segundoNombre,
                apellidos: registro.primerApellido + " " + registro.segundoApellido,
              }
            });

            this.totalResultados= data.totalElements;
            this.totalPaginas = data.totalPages;
            this.cargandoRegistros = false;
            this.cargandoFotos = false;
          }
          else{
            this.cargandoFotos = false;
            this.cargandoRegistros = false;
            this.datosNoEncontrados = true
          }
        },
        error: (error) => {
        this.cargandoFotos = false;
        this.cargandoRegistros = false;
        this.datosNoEncontrados = true
      }
    })
  }

  /**
   *
   * @param registro
   * Metodo que recibe el registro y abre la ista
   * de editar Datos
   */
  editarUsuario(registro:any){
    let registroUsuario = registro
    if(registroUsuario){
      const modalRef = this.modalService.open(EditarDatosComponent, {size: 'lg', centered: true, animation:false, backdrop: 'static'}
        )
      modalRef.componentInstance.registro = registroUsuario
    }
  }

  /**
   * Metodo para cerrar el modal
   */
  cerrar() {
    this.modalService.dismissAll()
  }
}
