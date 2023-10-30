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
  parametrosFiltros:any
  parametrosPagina:any
  totalResultados:any
  listaRegistrosAnuario:DatosFuncionarios[] = [];
  totalPaginas!:number;
  cargandoRegistros:boolean = false;
  pagina:number = 0;
  pageSize:number = 8;
  datosNoEncontrados:boolean = false;

  modalService = inject(NgbModal);

  constructor(
    private personalService: PersonalService) { }

  ngOnInit(){
    this.parametrosPagina = {
      sort: 'primerApellido,asc',
      size: this.totalResultados
    }
    this.obtenerDatosAnuario();
  }

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

  //Todo crear el metodo para llamar los datos ya filtrados.

  editarUsuario(registro:any){
    let registroUsuario = registro
    if(registroUsuario){
      const modalRef = this.modalService.open(EditarDatosComponent, {size: 'lg', centered: true, animation:false, backdrop: 'static'}
        )
      modalRef.componentInstance.registro = registroUsuario
    }
  }

  cerrar() {
    this.modalService.dismissAll()
  }



}
