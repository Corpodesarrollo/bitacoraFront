import { Component, EventEmitter, Input, Output } from '@angular/core';
import { niveles } from 'src/app/enums/niveles.enum';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { Perfil } from 'src/app/interfaces/perfil.interface';

@Component({
  selector: 'app-vista-inst-sede-jornada',
  templateUrl: './vista-inst-sede-jornada.component.html',
  styleUrls: ['./vista-inst-sede-jornada.component.scss']
})
export class VistaInstSedeJornadaComponent {

  @Input() infoUsuario:any
  @Output() cerrar_sesion = new EventEmitter<any>();
  @Output() accesoSeleccionado = new EventEmitter<any>();


  jornadas:any;
  ingresando:boolean = false;
  perfilSeleccionado:AccesoPerfil;

  pestanaSeleccionada:any;
  radioSeleccionado:any;
  opcionSeleccionada:any
  registroFiltrado:any;
  sinJornada:any


  ngOnInit(){
    const conteoJornadas = this.infoUsuario.reduce((acumulador: any[], item: any) => {
      const nombreJornada = item.jornada.nombre;
      if (nombreJornada !== null) {
        acumulador[nombreJornada] = (acumulador[nombreJornada] || 0) + 1;
      }
      return acumulador;
    }, {});
    const nombresJornadas = Object.keys(conteoJornadas);
    this.jornadas = nombresJornadas;
    this.pestanaSeleccionada = this.jornadas[0]
    this.mostrarPorJornada(this.pestanaSeleccionada)
  }


  /* Métodos para Matriz selección */
  mostrarPorJornada(jornada: string) {
    this.registroFiltrado = this.infoUsuario.filter((item: any) => item.jornada.nombre === jornada)
    if (this.registroFiltrado.length === 0) {
      this.sinJornada = true;
    } else {
      this.sinJornada = false;
    }
  };

  filtrarPorJornada(jornadaSelecionada:any) {
    this.radioSeleccionado = false;
    this.perfilSeleccionado = null
    this.pestanaSeleccionada = jornadaSelecionada;
    this.opcionSeleccionada = jornadaSelecionada;
    const jornada = jornadaSelecionada;
    this.registroFiltrado = this.infoUsuario.filter((item: any) => item.jornada.nombre === jornada)
    if (this.registroFiltrado.length === 0) {
      this.sinJornada = true;
    } else {
      this.sinJornada = false;
    }
  };


  //Valida radio activo y guarda valores seleccionados
  seleccionarDatos(datosUsuario: any) {
    this.radioSeleccionado = true;
    this.perfilSeleccionado = datosUsuario;
  }

  cerrarSesion(){
    this.cerrar_sesion.emit()
  }

  /**
   * Metood para contruir el formulario
   */


  async ingresar(){
    this.ingresando = true;
    await this.guardarSeleccion();
    this.ingresando = false;
  }


  async guardarSeleccion(){
    let accesoSeleccionado: AccesoPerfil;
    accesoSeleccionado = {
      'perfil': this.perfilSeleccionado.perfil,
      'localidad': this.perfilSeleccionado.localidad,
      'colegio': this.perfilSeleccionado.colegio,
      'sede': this.perfilSeleccionado.sede,
      'jornada': this.perfilSeleccionado.jornada,
    };
    this.accesoSeleccionado.emit(accesoSeleccionado);
  }
}
