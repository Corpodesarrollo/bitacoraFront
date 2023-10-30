import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { niveles } from 'src/app/enums/niveles.enum';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-vista-institucion',
  templateUrl: './vista-institucion.component.html',
  styleUrls: ['./vista-institucion.component.scss']
})
export class VistaInstitucionComponent {

  @Input() infoUsuario:any
  @Output() cerrar_sesion = new EventEmitter<any>();
  @Output() accesoSeleccionado = new EventEmitter<any>();

  ingresando:boolean = false;

  formNivelCuatro!: FormGroup
  listaInstituciones: any = []
  listaSedes:any = []
  listaJornadas:any = []
  perfilUsuario:any;

  tieneJornada:boolean = false;
  tieneSede:boolean = false;


  colegioSeleccionado:any;
  deshabilitarColegio:boolean = false;

  sedeSeleccionada:any;
  jornadaSeleccionada:any;

  //toDo Eliminar y orgnaizar estas vaiariables cuando se ajusten todos los niveles

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.construirFormularios();
  }

  ngOnInit(){
    this.cargarListas();
    this.validaSiSede();
    this.validaSiJornada();
  }


  /**
   * Valida si trae sede  y reinicia
   * los validadores
   */
  validaSiSede(){
    let tiene_sede = this.infoUsuario.some((item:any) => item.sede)
    if(!tiene_sede){
      this.formNivelCuatro.get('id_sede').clearValidators()
      this.formNivelCuatro.get('id_jornada').clearValidators()
    }
    this.tieneSede = tiene_sede;
  }

  /**
   * Valida si trae jornada
   * y reinicia
   */
  validaSiJornada(){
    let tiene_jornada = this.infoUsuario.some((item:any) => item.sede)
    if(!tiene_jornada){
      this.formNivelCuatro.get('id_jornada').clearValidators()
    }
    this.tieneJornada = tiene_jornada
  }

  /**
   * Metodo que crea el formulario
   * */
  construirFormularios() {
    this.formNivelCuatro = this.formBuilder.group({
      id_colegio: [null, Validators.required],
      id_sede: [{value:null, disabled: true}, Validators.required],
      id_jornada: [{value:null, disabled: true}, Validators.required]
    });
  }

  /**
   * Metdoo que recibe el campo del formulario
   * y lo valida
   * @param campo
   * @returns
   */
  campoNoValidoFormulario(campo: string) {
    return this.formNivelCuatro.get(campo)?.invalid && this.formNivelCuatro.get(campo)?.touched;
  }

  /**
   * Metodo para cargar la listas
   */

  cargarListas(){
    this.cargarInstituciones();
  }

  /**
   * Metodo que carga las instituciones,
   * si vienen repetidas solo las agrega una vez
   */
  cargarInstituciones(){
    this.deshabilitarColegio = false;
    let colegios = this.infoUsuario.map((item: any) => item.colegio);
    let colegios_sin_repetir = colegios.reduce((acumulador: { id: number, nombre: string, localidad: any }[], colegio: any) => {
      if (colegio && colegio.id && colegio.nombre) {
        const ya_existe = acumulador.some(item => item.id === colegio.id);
        if (!ya_existe) {
          acumulador.push(colegio);
        }
      }
      return acumulador;
    }, []);
    this.listaInstituciones = colegios_sin_repetir;
    if(colegios_sin_repetir.length === 1){
      this.formNivelCuatro.patchValue({ id_colegio : colegios_sin_repetir[0].id })
      this.formNivelCuatro.get('id_colegio').disable();
      this.obtenerSedes(colegios_sin_repetir[0]);
      this.deshabilitarColegio = true;
    }
  }

  obtenerSedes(colegio:any){
    if(!colegio){
      this.formNivelCuatro.patchValue({ id_sede: null});
      this.formNivelCuatro.get('id_sede').disable();
      this.formNivelCuatro.patchValue({ id_jornada: null});
      this.formNivelCuatro.get('id_jornada').disable();
    }
    this.listaSedes = [];
    this.listaJornadas = [];
    this.formNivelCuatro.controls['id_sede'].setValue(null)
    this.formNivelCuatro.controls['id_jornada'].setValue(null)
    const sedes_colegios = this.infoUsuario.map((item: any) => {
      if(item.colegio.id === colegio.id){
        return item.sede
      }
    });
    const sedes_filtradas = sedes_colegios.reduce((acumulador: { id: number, nombre: string }[], sede: any) => {
      if (sede && sede.id && sede.nombre) {
        const ya_existe = acumulador.some(item => item.id === sede.id);
        if (!ya_existe) {
          acumulador.push({ id: sede.id, nombre: sede.nombre });
        }
      }
      return acumulador;
    }, []);
    this.listaSedes = sedes_filtradas.sort();
    this.formNivelCuatro.get('id_sede').enable();
    this.colegioSeleccionado = colegio;
    //todoRemover despues de que se ajuste el objeto
  }

  obtenerJornadas(sede:any) {
    if(!sede){
      this.formNivelCuatro.patchValue({ id_jornada: null});
      this.formNivelCuatro.get('id_jornada').disable();
    }
    this.listaJornadas = [];
    let sede_seleccionada = this.formNivelCuatro.get('id_sede').value
    let colegio_seleccionado = this.formNivelCuatro.get('id_colegio').value
    this.infoUsuario.forEach((item: any) => {
      if(item.sede.id === sede_seleccionada && item.colegio.id == colegio_seleccionado){
        this.listaJornadas.push(item.jornada)
      }
    });
    this.listaJornadas.sort((a:any, b:any) => a.id - b.id);
/*
    const jornadas_filtradas = jornada_sede.reduce((acumulador: { id: number, nombre: string }[], jornada: any) => {
      if (jornada && jornada.id && jornada.nombre) {
        const yaExiste = acumulador.some(item => item.id === jornada.id);
        if (!yaExiste) {
          acumulador.push({ id: jornada.id, nombre: jornada.nombre });
        }
      }
      return acumulador;
    }, []);
    this.listaJornadas = jornadas_filtradas.sort(); */
    this.formNivelCuatro.get('id_jornada').enable();
    this.sedeSeleccionada = sede
  }

  /**
   * Metodo que guarda la jornada
   * seleccionada
   */
  seleccionarJornada(jornada:any){
    this.jornadaSeleccionada = jornada;
  }


  cerrarSesion(){
    this.cerrar_sesion.emit()
  }

  async ingresar(){
    if (this.formNivelCuatro.invalid) {
      Object.values(this.formNivelCuatro.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
    else{
      this.ingresando = true;
      await this.guardarSeleccion();
    }
  }

  async configurarPerfilUsuario(){
    let perfilUsuario = await this.infoUsuario.filter((item: any) => item.colegio.id  == this.colegioSeleccionado.id && item.sede.id == this.sedeSeleccionada.id && item.jornada.id == this.jornadaSeleccionada.id );
    this.perfilUsuario = perfilUsuario[0].perfil;
  }

  async guardarSeleccion(){
    let accesoSeleccionado: AccesoPerfil;
    await this.configurarPerfilUsuario()
    accesoSeleccionado = {
      'perfil': this.perfilUsuario,
      'localidad': this.colegioSeleccionado?.localidad,
      'colegio': this.colegioSeleccionado,
      'sede': this.sedeSeleccionada,
      'jornada': this.jornadaSeleccionada,
    };
    this.accesoSeleccionado.emit(accesoSeleccionado);
  }
}
