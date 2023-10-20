import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListaGenerales } from 'src/app/classes/lista_generales.interfaces';
import { ListaJornadas } from 'src/app/classes/lista_jorandas.interface';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { AsignacionAcademicaService } from 'src/app/services/api/personal/asignacion-academica.service';

@Component({
  selector: 'app-filtros-asignacion',
  templateUrl: './filtros-asignacion.component.html',
  styleUrls: ['./filtros-asignacion.component.scss']
})

export class FiltrosAsignacionComponent {

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
    id_vigencia: 0,
    id_sede: 0,
    id_jornada: 0,
    id_metodologia: 0
  };
  desactivarJornadas: boolean;

  constructor(
    private formBuilder:FormBuilder,
    private personalService: PersonalService,
    private servicioModal: NgbModal,
    private mensajesService: MensajesService,
    private asignacionAcademicaService:AsignacionAcademicaService
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
      id_vigencia:[null,Validators.required],
      id_metodologia:[null, Validators.required],
      id_jornada:[null, Validators.required],
      id_sede:[null, Validators.required],
    });

    }


  campoNoValido(campo:string){
    return this.formFiltros.get(campo)?.touched && this.formFiltros.get(campo)?.invalid
  }

  cargarListas(){

    this.cargarVigencias();
    this.cargarMetodologia();

    this.formFiltros.controls['id_jornada'].disable();
    this.desactivarJornadas = true


    this.personalService.obtenerSedes(this.idColegio).subscribe({
      next: (respuesta:any) => {
        this.sedes = respuesta;
      },
      error: (error) => console.log(error)
    })

    this.personalService.obtenerPerfiles().subscribe({
      next: (respuesta:any) => {
        if(respuesta.status === 200){
          this.tiposIdentificacion = respuesta.data
        }
        else{
         // console.log(respuesta.mensaje);
        }
      },
      error: (error) => console.log(error)
    })
  }

  cargarVigencias(){
     this.asignacionAcademicaService.obtenerVigencias().subscribe((resp:any)=>{
      if(resp.status == 200){
        this.vigencias = resp.data;
      }
     })
  }

  cargarJornada(){

    let parametros = {
       id_colegio: this.idColegio,
       id_sede: this.formFiltros.get('id_sede')?.value
    }

    if(parametros.id_sede === null || parametros.id_sede === ''){
      this.jornadas = []
      this.formFiltros.controls['id_jornada'].setValue(null);
      this.desactivarJornadas = true
      this.formFiltros.controls['id_jornada'].disable();
    }
    else{
      this.personalService.obtenerJonadaPorSede(parametros).subscribe({
        next: (respuesta: HttpResponse<any>) =>{
          if(respuesta.status === 200 ){
            this.desactivarJornadas = false
            this.formFiltros.controls['id_jornada'].enable();
            this.jornadas = respuesta.body.data
            // console.log(this.jornadas)
            // campo_jornada?.enable()
          }
        },
        error: (error) => console.log(error)
      })
    }
  }

  cargarMetodologia(){
    this.asignacionAcademicaService.obtenerMetodologias(this.idColegio).subscribe((resp:any)=>{
      if(resp.status == 200){
        this.metodologias = resp.data;
      }
    })
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

      this.parametrosFiltros.id_vigencia = this.formFiltros.get('id_vigencia')?.value
      this.parametrosFiltros.id_metodologia = this.formFiltros.get('id_metodologia')?.value
      this.parametrosFiltros.id_sede =this.formFiltros.get('id_sede')?.value
      this.parametrosFiltros.id_jornada =this.formFiltros.get('id_jornada')?.value

      this.filtros.emit(this.parametrosFiltros);
  }

}
