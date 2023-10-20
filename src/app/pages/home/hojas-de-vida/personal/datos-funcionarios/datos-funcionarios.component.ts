import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { DatosFuncionarios } from 'src/app/classes/datos_funcionarios.interface';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditarFotoUsuarioComponent } from '../editar-foto-usuario/editar-foto-usuario.component';
import { EditarDatosComponent } from '../editar-datos/editar-datos.component';
import { AnuarioComponent } from '../anuario/anuario.component';
import { DesasociarFuncionarioComponent } from '../desasociar-funcionario/desasociar-funcionario.component';
import { InactivarUsuarioComponent } from '../inactivar-usuario/inactivar-usuario.component';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';

@Component({
  selector: 'app-datos-funcionarios',
  templateUrl: './datos-funcionarios.component.html',
  styleUrls: ['./datos-funcionarios.component.scss']
})
export class DatosFuncionariosComponent {

  cargandoRegistros:boolean = false;
  cargandoDatos:boolean = false;
  datosNoEncontrados:boolean = false;
  exportandoDatos:boolean = false;
  mostrarFiltros:boolean = true;

  listaRegistros:DatosFuncionarios[] = [];

  totalPaginas!:number;
  totalResultados!:number;
  pagina:number = 0;
  pageSize:number = 10;
  registrosOrdenados:boolean = false;
  columnaOrden:string = 'primerNombre'
  esAscendente:boolean = true

  parametrosPagina = {
    pagina: this.pagina,
    size: this.pageSize,
    sort: 'primerNombre,asc'
  }

  ordenadaAscendente:any = {
    n: false,
    tipoIdentificacion: false,
    identificacion: false,
    cargo: false,
    primerApellido: false,
    primerNombre: true,
  };

  parametrosFiltros = {
    sede: "",
    jornada: "",
    tipoPersonal:"",
    identificacion:"",
    primer_nombre:"",
    segundo_nombre:"",
    primer_apellido:"",
    segundo_apellido:"",
    institucion: "",
  };

  constructor(
    private personalService: PersonalService,
    private modalService: NgbModal,
    ){
  }



  /**
   * Carga el servicio con los datos del filtro de busqueda
   */
  obtenerDatos(){
    this.cargandoDatos = true
    this.listaRegistros = [];
    this.personalService.obtenerDatosFiltrados(this.parametrosFiltros, this.parametrosPagina).subscribe({
      next: (respuesta: HttpResponse<any>) =>{
        if(respuesta.status === 200){
            const data = respuesta.body.data
            this.listaRegistros = data.content.map((registro:any, index:any) =>{
              const indiceCalculado = index + 1 + this.pagina * this.pageSize;
              return{
                ...registro,
                indice: indiceCalculado,
                nombres: registro.primerNombre + " " + registro.segundoNombre,
                apellidos: registro.primerApellido + " " + registro.segundoApellido
              }
            });
            this.totalResultados= data.totalElements;
            this.totalPaginas = data.totalPages;
            this.cargandoRegistros = false;
            this.cargandoDatos = false;
            this.mostrarFiltros = false;
          }
          else if(respuesta.status === 207 && this.totalResultados > 0){
            this.abrirFiltros()
          }
          else{
            this.cargandoDatos = false;
            this.cargandoRegistros = false;
            this.datosNoEncontrados = true
          }
        },
        error: (error) => {
        this.cargandoDatos = false;
        this.cargandoRegistros = false;
        this.datosNoEncontrados = true
      }
    })
  }

  /**
   * Construye los parametros recibidos del componente filtros
   * @param evento
   * Pone la bandera de datos encontrados en 0 y en 1 el cargando registros
   * En 3 linea reinica la lista de registros
   * Em la 4 linea asigna el evento (los filtros)
   */
  filtrar(evento:any){
    this.cargandoRegistros = true
    this.datosNoEncontrados = false;
    this.listaRegistros = []
    this.parametrosFiltros = evento;
    if(this.parametrosFiltros.sede || this.parametrosFiltros.jornada || this.parametrosFiltros.tipoPersonal || this.parametrosFiltros.identificacion || this.parametrosFiltros.primer_nombre || this.parametrosFiltros.segundo_nombre || this.parametrosFiltros.primer_apellido || this.parametrosFiltros.segundo_apellido || this.parametrosFiltros.institucion != ''){
      this.parametrosPagina.pagina = -1
      this.obtenerDatos();
    }
    else{
      this.cargandoRegistros = false;
      this.datosNoEncontrados = true;
    }
  }

  /**
   * Nos permite actualizar el tamaño de la vista de la lista
   */
  actualizarTamano(valor:any){
    this.parametrosPagina.size = valor;
    let nuevoTotalPaginas = Math.round(this.totalResultados / valor);
    if(this.pagina >= nuevoTotalPaginas){
      this.pagina = Math.max(nuevoTotalPaginas - 1, 0)
      this.parametrosPagina.pagina = this.pagina;
      this.obtenerDatos()
    }
    else{
      this.obtenerDatos();
    }
  }

  /**
   * Abre la vista para realizsar los filtors y renicia los valores
   */
  abrirFiltros(){
    this.listaRegistros = [];
    this.mostrarFiltros = true;
    this.parametrosFiltros = {
      sede: "",
      jornada: "",
      tipoPersonal:"",
      identificacion:"",
      primer_nombre:"",
      segundo_nombre:"",
      primer_apellido:"",
      segundo_apellido:"",
      institucion: "",
    };
    this.esAscendente = true;
    this.columnaOrden = 'primerNombre'
    this.parametrosPagina.pagina = 0;
    this.parametrosPagina.size = 10;
    this.parametrosPagina.sort = 'primerNombre','sort'
    this.pageSize = 10;
    this.pagina = 0;
    this.totalResultados = 0;
    for( let col in this.ordenadaAscendente){
      this.ordenadaAscendente[col] = false
      if(col === 'primerNombre'){
        this.ordenadaAscendente[col] = true;
      }
    }
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
    if (this.ordenadaAscendente['n']) {
      this.listaRegistros.sort((a:any, b:any) => compare(b.indice, a.indice));
    } else {
      this.listaRegistros.sort((a:any, b:any) => compare(a.indice, b.indice));
    }
  }

  /**
   * Funcion que recibe el numero de pagina
   * y consulta los registros
   * @param valor
   */
  cambiarPagina(valor?:string){
    if(valor === 'siguiente'){
      if( this.pagina < this.totalPaginas - 1){
        this.pagina = this.pagina + 1
        this.parametrosPagina.pagina = this.pagina
        this.obtenerDatos()
      }
    }
    else if (this.pagina > 0) {
      this.pagina = this.pagina - 1;
      this.parametrosPagina.pagina = this.pagina
      this.obtenerDatos()
    }
  }

  /**
   * Abre el componente para editar los datos del funcionario
   */
  editarUsuario(registro:any){
    let registroUsuario = registro
    if(registro.estado === "INACTIVO" || registro.estado === "" || registro.estado === null){
      const modal = this.modalService.open(ModalInformacionComponent, {size: 'md', centered: true, animation:false, backdrop: 'static'})
      modal.componentInstance.informacion = {
        esExitoso: 'warning',
        titulo: '¡Advertencia!',
        mensaje: 'No puede realizar alguna acción, ya que el usuario se encuentra deshabilitado.'
      }
    }
    else{
      const modalRef = this.modalService.open(EditarDatosComponent, {size: 'xl', centered: true, animation:false, backdrop: 'static'}
        )
      modalRef.componentInstance.registro = registroUsuario
      modalRef.result.then(( result) => {
        this.obtenerDatos()
      })
    }
  }

  /**
   * Agregar la fotografia del usaurio
   */
  editarFotografia(registro:any){
    if(registro.estado === "INACTIVO" || registro.estado === "" || registro.estado === null){
      const modal = this.modalService.open(ModalInformacionComponent, {size: 'md', centered: true, animation:false, backdrop: 'static'})
      modal.componentInstance.informacion = {
        esExitoso: 'warning',
        titulo: '¡Advertencia!',
        mensaje: 'No puede realizar alguna acción, ya que el usuario se encuentra deshabilitado.'
      }
    }
    else{
      const modalFotografia = this.modalService.open(EditarFotoUsuarioComponent, { size: 'lg',  centered: true, animation:false, backdrop: 'static'})
      modalFotografia.componentInstance.traeBotones =true
      modalFotografia.componentInstance.registroUsuario = registro
      modalFotografia.result.then(() => {
          this.obtenerDatos()
      })
    }
  }


  /**
   * Exporta los datos en formato excel
   * acorde a la busqueda y filtros del usuario.
   */
  exportarDatos(){
    const nombreArchivo = 'resultados.xlsx';
    const headers = [
      'Numeración de registro',
      'Tipo de Identificación',
      'Número de Identificación',
      'Cargo',
      'Apellidos',
      'Nombres',
      'Estado',
      'Correo Institucional',
    ]

    const parametrosPagina  = {
      pagina: -1,
      size: this.totalResultados,
      sort: 'primerNombre,asc'
    }
    this.exportandoDatos = true
    this.personalService.obtenerDatosFiltrados(this.parametrosFiltros, parametrosPagina).subscribe({
      next: (respuesta: HttpResponse<any>) =>{
        if(respuesta.status === 200){
          const data = respuesta.body.data
          const datos = data.content.map((registro:any, index:any) =>{
            const nuevoRegistro = {
              numeracion: index + 1,
              tipo_documento: registro.tipoIdentificacion,
              identificacion: registro.identificacion,
              cargo: registro.cargo,
              apellidos: registro.primerApellido + ' ' + registro.segundoApellido,
              nombres: registro.primerNombre + ' ' + registro.segundoNombre,
              estado: registro.estado === "" ? "INACTIVO" : registro.estado,
              correo: registro.correo
            }
            return nuevoRegistro
          });
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos)
          XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          const columnWidths = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 25 },
            { wch: 20 },
            { wch: 50 },
          ];
          ws['!cols'] = columnWidths
          XLSX.utils.book_append_sheet(wb, ws, 'Lista funcionarios')
          XLSX.writeFile(wb, nombreArchivo);
          this.exportandoDatos = false
        }
      },
      error:(error:any) =>{
        const modalError = this.modalService.open(ModalInformacionComponent, {size: 'md', animation: false, backdrop: 'static', centered:true})
        modalError.componentInstance.informacion = {
          esExitoso: 'error',
          titulo: '¡Error!',
          mensaje: 'No se pudo generar el excel'
        }
        this.exportandoDatos = false
      }
    })
  }

  abrirAnuario() {
    let modalSize = '';
    if (this.totalResultados == 1) {
      modalSize = 'sm';
    }
    else if (this.totalResultados == 2) {
      modalSize = 'lg';
    }
   else  if (this.totalResultados >= 3) {
      modalSize = 'xl';
    }
    const modalAnuario = this.modalService.open(AnuarioComponent, {
      size: modalSize,
      centered: true,
      backdrop: 'static',
      animation: true,
    });

    modalAnuario.componentInstance.parametrosFiltros = this.parametrosFiltros;
    modalAnuario.componentInstance.totalResultados = this.totalResultados;
  }


  abrirDesasociar(registro:any) {
    const modalDesasociar = this.modalService.open(DesasociarFuncionarioComponent, { size: '600px', centered: true, backdrop: 'static'});
    let identificacion = registro.identificacion
    modalDesasociar.componentInstance.identificacion = identificacion
    modalDesasociar.result.then((result) => {
      if(result == true){
        this.obtenerDatos()
      }
    })
  }

  abrirInactivar(event:any, registro:any) {
    event.preventDefault();

    const modalInactivar = this.modalService.open(InactivarUsuarioComponent, { size: '600px', centered: true, backdrop: 'static'});
    modalInactivar.componentInstance.registro = registro
    modalInactivar.result.then((result) => {
      if(result == true){
        this.obtenerDatos()
      }
    })
  }
}
