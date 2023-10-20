import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaGenerales } from 'src/app/classes/lista_generales.interfaces';
import { ListaJornadas } from 'src/app/classes/lista_jorandas.interface';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  sedes:any;
  jornadas:ListaJornadas[] = [];
  tiposIdentificacion:ListaGenerales[] = [];
  metodologias:any[] = [];
  vigencias:any[] = [];

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

  constructor(
    private formBuilder:FormBuilder,
    private personalService: PersonalService,
    private servicioModal: NgbModal
  ){
    let datos_usuario  = JSON.parse(sessionStorage.getItem('sap_sec_percol')!)
    this.idColegio =  datos_usuario.colegio.idColegio;
    this.construirFormularios();
    this.cargarListas();
  }

  ngAfterViewChecked()	{
  }

  construirFormularios(){
    this.formFiltros = this.formBuilder.group({
      sede: [null],
      jornada: [{ value: null, disabled: true}],
      tipo_personal: [null],
      numero_identificacion: ['', [Validators.maxLength(25),Validators.pattern('^[0-9]+')] ],
      primer_nombre: ['', Validators.maxLength(30)],
      segundo_nombre: ['',Validators.maxLength(30)],
      primer_apellido: ['', Validators.maxLength(30)],
      segundo_apellido: ['', Validators.maxLength(30)],
    })
  }

  campoNoValido(campo:string){
    return this.formFiltros.get(campo)?.touched && this.formFiltros.get(campo)?.invalid
  }

  cargarListas(){

    this.personalService.obtenerSedes(this.idColegio).subscribe({
      next: (respuesta:any) => {
        this.sedes = respuesta;
      },
      error: (error) => console.log(error)
    })

    this.personalService.obtenerPerfilesPorTipo().subscribe({
      next: (respuesta:any) => {
        if(respuesta.status === 200){
          this.tiposIdentificacion = respuesta.data
        }
      },
      error: (error) => console.log(error)
    })
  }

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
      this.personalService.obtenerJonadaPorSede(parametros).subscribe({
        next: (respuesta: HttpResponse<any>) =>{
          if(respuesta.status === 200 ){
            this.jornadas = respuesta.body.data
            campo_jornada?.enable()
          }
        },
        error: (error) => console.log(error)
      })
    }
  }

  validarDatosIngresados(){
    const formValues = this.formFiltros.value;
    for (const value of Object.values(formValues)) {
      if (value !== null && value !== '') {
        return true;
      }
    }
    return false;
  }

  limmpiarDatos(){
    this.formFiltros.reset();
    this.jornadas  = []
  }

  buscar(){
      this.parametrosFiltros.sede = this.formFiltros.get('sede')?.value;
      this.parametrosFiltros.jornada = this.formFiltros.get('jornada')?.value;
      this.parametrosFiltros.tipo_personal = this.formFiltros.get('tipo_personal')?.value;
      this.parametrosFiltros.identificacion = this.formFiltros.get('numero_identificacion')?.value;
      this.parametrosFiltros.primer_nombre = this.formFiltros.get('primer_nombre')?.value;
      this.parametrosFiltros.segundo_nombre = this.formFiltros.get('segundo_nombre')?.value;
      this.parametrosFiltros.primer_apellido = this.formFiltros.get('primer_apellido')?.value;
      this.parametrosFiltros.segundo_apellido = this.formFiltros.get('segundo_apellido')?.value;
      this.parametrosFiltros.institucion = this.idColegio.toString();
      this.filtros.emit(this.parametrosFiltros);
  }

}
