import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EstudianteHome } from 'src/app/interfaces/estudiante_home.interface';
import { InicioService } from 'src/app/services/api/inicio/inicio.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-estudiantes',
  templateUrl: './lista-estudiantes.component.html',
  styleUrls: ['./lista-estudiantes.component.scss']
})
export class ListaEstudiantesComponent {

  @Input() idColegio:number;
  @Input() idSede:number;
  @Input() idJornada:number;
  @Output() abrirRuta = new EventEmitter<string>();


  idUsuario:string
  cargandoEstudiantes:boolean;
  nombreEstudiante:string;
  apellidosEstudiante:string;
  estudiantes:EstudianteHome[] = [];
  totalColegios: number = 0;
  paginaActual: number = 1;
  tamanoPagina: number = 10;
  totalPaginas:number

  constructor(
    private inicioServices: InicioService,
    private usuarioService: UsuarioService,
    private router: Router
  ){
    this.idUsuario = this.usuarioService.obtenerUsuario().id
  }

  ngOnInit(){
    this.cargarEstudiantes();
  }

  /**
   * Metodo para cargar la lista de
   * estudiantes
   */
  cargarEstudiantes(){
    this.cargandoEstudiantes = true
    let parametros = {
      id_colegio: this.idColegio,
      numero_pagina: this.paginaActual,
      tamano_pagina: this.tamanoPagina,
      id_Sede: this.idSede,
      id_jornada: this.idJornada,
    }
    if(this.idColegio && this.idSede && this.idJornada){
      this.inicioServices.obtenerListaEstudiantes(parametros).subscribe({
        next: (respuesta:any) => {
          if(respuesta.code == 200){
            let datos_estudiante = respuesta.data.data
            this.estudiantes = this.validaNombres(datos_estudiante)
            this.totalColegios = respuesta.data.totalRegistros
            this.paginaActual = respuesta.data.paginaActual
            this.totalPaginas = respuesta.data.numeroPaginas
            this.cargandoEstudiantes =false;
          }
          else{
            this.cargandoEstudiantes = false;
          }
        },
        error: (error) => {
          this.cargandoEstudiantes = false
          console.log(error)
        }
      })
    }
    else{
      this.estudiantes = []
      this.cargandoEstudiantes = false;
    }
  }

  validaNombres(lista_estudiantes:any){
    return lista_estudiantes.map((estudiante:EstudianteHome, index:number) => {
      let nombre_uno =  this.removerNulos(estudiante.estnombre1);
      let nombre_dos = this.removerNulos(estudiante.estnombre2);
      let apellido_uno = this.removerNulos(estudiante.estapellido1);
      let apellido_dos = this.removerNulos(estudiante.estapellido2);
      this.removerNulos(this.apellidosEstudiante);
      return {
        ...estudiante,
        nombres: nombre_uno + ' ' + nombre_dos,
        apellidos: apellido_uno + ' ' + apellido_dos
      }
    })
  }


  removerNulos(value: string): string {
    if (!value) return value;
    return value.split(' ').filter(word => word.toLowerCase() !== 'null').join(' ');
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.cargarEstudiantes();
  };

  abrirOpcion(){
    const url = `${environment.URL_ESTUDIANTES}/index/${this.idUsuario}/${this.idColegio}/${this.idSede}/${this.idJornada}`
    this.router.navigate(['/home/ver', url])

  }

}
