import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaGenerales } from 'src/app/interfaces/lista_generales.interfaces';
import { ListaJornadas } from 'src/app/interfaces/lista_jorandas.interface';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})

export class FiltrosComponent {

  formFiltros!: FormGroup;
  idColegio: number;

  @Input() cargandoRegistros: boolean = false;
  @Output() filtros = new EventEmitter<any>();

  /**
   * Listas generales
   */
  sedes:any;
  jornadas:ListaJornadas[] = [];
  tiposIdentificacion:ListaGenerales[] = [];
  metodologias:any[] = [];
  vigencias:any[] = [];

  /**
   * Banderas para la lsitas
   */
  cargandoJornadas:boolean = false;
  cargandoSedes:boolean = false;
  cargandoPerfiles:boolean = false;

  parametrosFiltros = {
    sede: "",
    jornada: "",
    tipo_personal:"",
    identificacion:"",
    primer_nombre:"",
    segundo_nombre:"",
    primer_apellido:"",
    segundo_apellido:"",
    institucion: "",
    id_sede: 0,
    id_jornada: 0
  };


  /**
   *
   * @param formBuilder
   * @param personalService
   * @param usuarioService
   * Construye los servicios
   * carga el id del colegio
   */
  constructor(
    private formBuilder:FormBuilder,
    private personalService: PersonalService,
    private usuarioService: UsuarioService,
  ){
    let datos_usuario  = this.usuarioService.obtenerAccesoSeleccionado()
    this.idColegio =  datos_usuario.colegio.id;
    this.construirFormularios();
    this.cargarListas();
  }


  /**
   * Metodo que construy el fomulario
   */
  construirFormularios(){
    this.formFiltros = this.formBuilder.group({
      sede: [-1],
      jornada: [{ value: null, disabled: true}],
      tipo_personal: [-1],
      numero_identificacion: ['', [Validators.maxLength(25),Validators.pattern('^[0-9]+')] ],
      primer_nombre: ['', Validators.maxLength(30)],
      segundo_nombre: ['',Validators.maxLength(30)],
      primer_apellido: ['', Validators.maxLength(30)],
      segundo_apellido: ['', Validators.maxLength(30)],
    })
  }

  /**
   * Metodo que recibe el campo del formulario
   * y valida si es valido
   * @param campo
   * @returns
   */
  campoNoValido(campo:string){
    return this.formFiltros.get(campo)?.touched && this.formFiltros.get(campo)?.invalid
  }

  /**
   * Metodo que se encarga de cargar las listas
   * que se vana mostrar en los selects
   * Carrga sedes
   * Carga Perfiles
   *
   */
  cargarListas(){
    this.cargandoSedes = true;
    this.cargandoPerfiles = true;
    this.personalService.obtenerSedes(this.idColegio).subscribe({
      next: (respuesta:any) => {
        this.sedes =[{ codigo: -1, nombre: 'TODAS', etiqueta: 'TODAS' }, ...respuesta]
        ;
        this.cargandoSedes = false
      },
      error: (error) => console.log(error)
    })

    this.personalService.obtenerPerfilesPorTipo().subscribe({
      next: (respuesta:any) => {
        if(respuesta.status === 200){
          this.tiposIdentificacion = [{ codigo: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...respuesta.data]
          this.cargandoPerfiles = false
        }
      },
      error: (error) => console.log(error)
    })
  }


  /**
   * Metodo que carga la jornada
   * acorde a la sede seleccionada
   */
  cargarJornada(){
    let cod_sede = this.formFiltros.get('sede')?.value
    let campo_jornada = this.formFiltros.get('jornada')
    let parametros = {
      id_colegio: this.idColegio,
      id_sede: cod_sede
    }
    if(parametros.id_sede === null || parametros.id_sede === ''){
      this.jornadas = []
      campo_jornada?.setValue(null);
      campo_jornada?.disable();
    }
    else{
      this.cargandoJornadas = true;
      this.personalService.obtenerJonadaPorSede(parametros).subscribe({
        next: (respuesta: HttpResponse<any>) =>{
          if(respuesta.status === 200 ){
            this.jornadas =  [{ id: -1, nombre: 'TODAS', etiqueta: 'TODAS' }, ...respuesta.body.data]
            this.formFiltros.controls['jornada'].setValue(-1)
            campo_jornada?.enable()
            this.cargandoJornadas = false
          }
        },
        error: (error) => console.log(error)
      })
    }
  }

  /**
   * Metodo para validar que no envie
   * campos nulls y vacios
   * @returns
   */
  validarDatosIngresados(){
    const formValues = this.formFiltros.value;
    for (const value of Object.values(formValues)) {
      if (value !== null && value !== '') {
        return true;
      }
    }
    return false;
  }

  /**
   * Metodo para limpiar el
   * formulario
   */
  limmpiarDatos(){
    this.formFiltros.reset();
    this.jornadas  = []
  }

  /**
   * Metodo que se encarga de
   * emitir el evento con los filtors seleccionados
   * este evento se recibe en '../datos-funcionarios.component.ts'
   */
  buscar(){
      this.parametrosFiltros.sede = this.formFiltros.get('sede')?.value == -1 ? "" : this.formFiltros.get('sede')?.value ;
      this.parametrosFiltros.jornada = this.formFiltros.get('jornada')?.value == -1 ? "" : this.formFiltros.get('jornada')?.value;
      this.parametrosFiltros.tipo_personal = this.formFiltros.get('tipo_personal')?.value == -1 ? "" : this.formFiltros.get('tipo_personal')?.value;
      this.parametrosFiltros.identificacion = this.formFiltros.get('numero_identificacion')?.value;
      this.parametrosFiltros.primer_nombre = this.formFiltros.get('primer_nombre')?.value;
      this.parametrosFiltros.segundo_nombre = this.formFiltros.get('segundo_nombre')?.value;
      this.parametrosFiltros.primer_apellido = this.formFiltros.get('primer_apellido')?.value;
      this.parametrosFiltros.segundo_apellido = this.formFiltros.get('segundo_apellido')?.value;
      this.parametrosFiltros.institucion = this.idColegio.toString();
      this.filtros.emit(this.parametrosFiltros);
  }

}
