import { Component, Input } from '@angular/core';
import { ColegioAdmin } from 'src/app/interfaces/colegio_admin.interface';
import { InicioService } from 'src/app/services/api/inicio/inicio.service';

@Component({
  selector: 'app-lista-colegios',
  templateUrl: './lista-colegios.component.html',
  styleUrls: ['./lista-colegios.component.scss']
})
export class ListaColegiosComponent {


  colegios:ColegioAdmin[] = []
  cargandoColegios:boolean
  @Input() localidad: number;
  totalColegios: number = 0;
  paginaActual: number = 1;
  tamanoPagina: number = 10;
  totalPaginas:number;

  constructor(
    private inicioServices: InicioService
  ){
  }

  ngOnInit(){
    this.cargarColegios();

  }
  /**
   * Metodo que carga la lista de colegios
   *
   */
  cargarColegios(){
    this.cargandoColegios = true
    let parametros = {
      localidad: this.localidad,
      numero_pagina: this.paginaActual,
      tamano_pagina: this.tamanoPagina
    }
    this.inicioServices.obtenerListaColegios(parametros).subscribe({
      next: (respuesta:any) => {
        if(respuesta.code == 200){
          let datos_colegio = respuesta.data.data
          this.colegios = datos_colegio
          this.totalColegios = respuesta.data.totalRegistros;
          this.paginaActual = respuesta.data.paginaActual;
          this.totalPaginas = respuesta.data.numeroPaginas;
        }
        this.cargandoColegios = false
      },
      error: (error) => {
        this.cargandoColegios = false
        console.log(error);
      }
    })
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.cargarColegios();
  };

}
