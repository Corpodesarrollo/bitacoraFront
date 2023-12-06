import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { niveles } from 'src/app/enums/niveles.enum';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { Dependencia } from 'src/app/interfaces/dependencia.interface';
import { Localidad } from 'src/app/interfaces/localidad.interface';
import { Perfil } from 'src/app/interfaces/perfil.interface';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-vista-no-institucion',
  templateUrl: './vista-no-institucion.component.html',
  styleUrls: ['./vista-no-institucion.component.scss']
})
export class VistaNoInstitucionComponent implements OnInit {
  @Input() infoUsuario:any
  @Output() cerrar_sesion = new EventEmitter<any>();
  @Output() accesoSeleccionado = new EventEmitter<any>();

  formNoInstitucion!: FormGroup;

  ingresando:boolean = false;
  seleccionarDependencia:boolean = false;
  seleccionarLocalidad:boolean = false;

  perfilSeleccionado:Perfil;
  localidadSeleccionada:Localidad;
  dependenciaSeleccionada:Dependencia;

  perfiles: Perfil[]=[];
  dependencias: Dependencia[]=[];
  localidades: Dependencia[]=[];

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.construirFormularios();
  }

  ngOnInit(): void {
    this.construirFormularios();
    this.cargarListas();
  };

   /**
   * Metodo que crea el formulario
   * */
   construirFormularios() {
    this.formNoInstitucion = this.formBuilder.group({
      perfil_id: [null, Validators.required],
      dependencia_id: [{value:null, disabled: true}],
      localidad_id: [{value:null, disabled: true}]
    });
  }

  campoNoValidoFormulario(campo: string) {
    return this.formNoInstitucion.get(campo)?.invalid && this.formNoInstitucion.get(campo)?.touched;
  }

  cargarListas(){
    this.cargarPerfiles();
  }

  cargarPerfiles(){
    for(let a=0; a<this.infoUsuario.length; a++){
      this.agregarPerfil(this.infoUsuario[a].perfil);
    }
  }

  agregarPerfil(perfil:Perfil){
    if(this.perfiles.length>0){
      let perfilEncontrado = this.perfiles.find((perfilAgregado:Perfil)=> perfilAgregado.nombre==perfil.nombre);
      if(!perfilEncontrado){
        this.perfiles.push(perfil);
      }
    }else{
      this.perfiles.push(perfil);
    }
  }

  async ingresar(){
    if (this.formNoInstitucion.invalid) {
      Object.values(this.formNoInstitucion.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
    else{
      this.ingresando = true;
      await this.guardarSeleccion();
    }
  }

  seleccionPerfil(perfil:Perfil){

    this.perfilSeleccionado = perfil;
    this.seleccionarLocalidad = false;
    this.dependencias=[];
    this.localidades=[];
    if(perfil.idPerfilNivel==niveles.nivel_central_poa){
      for(let a=0; a<this.infoUsuario.length; a++){
        if(this.infoUsuario[a].perfil.nombre==perfil?.nombre){
          if(this.infoUsuario[a].dependencia)
            this.agregarDependencia(this.infoUsuario[a].dependencia);
        }
      }
    }else{
      this.seleccionarDependencia=false;
    }

    if(perfil.idPerfilNivel==niveles.localidad){
      for(let a=0; a<this.infoUsuario.length; a++){
        if(this.infoUsuario[a].perfil.nombre==perfil.nombre){
          if(this.infoUsuario[a].localidad)
            this.agregarLocalidad(this.infoUsuario[a].localidad);
        }
      }
    }else{
      this.seleccionarLocalidad=false;
    }
  }

  agregarDependencia(dependencia:Dependencia){
    this.formNoInstitucion.get('dependencia_id').disable();
    this.formNoInstitucion.get('dependencia_id').clearValidators();
    this.formNoInstitucion.get('dependencia_id').setValue(null);
    if(this.dependencias.length>0){
      let dependenciaEncontrada = this.dependencias.find((dependenciaAgregada:Dependencia)=> dependenciaAgregada.nombre==dependencia.nombre);
      if(!dependenciaEncontrada){
        this.dependencias.push(dependencia);
      }
    }else{
      this.dependencias.push(dependencia);
    }
    if(this.dependencias.length>0) {
      this.seleccionarDependencia = true;
      this.formNoInstitucion.get('dependencia_id').setValidators(Validators.required);
      this.formNoInstitucion.get('dependencia_id').enable();
    }
  }

  agregarLocalidad(localidad:Localidad){
    this.formNoInstitucion.get('localidad_id').disable();
    this.formNoInstitucion.get('localidad_id').clearValidators();
    this.formNoInstitucion.get('localidad_id').setValue(null);
    if(this.localidades.length>0){
      let localidadEncontrada = this.localidades.find((localidadAgregada:Localidad)=> localidadAgregada.nombre==localidad.nombre);
      if(!localidadEncontrada){
        this.localidades.push(localidad);
      }
    }else{
      this.localidades.push(localidad);
    }
    if(this.localidades.length>0) {
      this.seleccionarLocalidad = true;
      this.formNoInstitucion.get('localidad_id').setValidators(Validators.required);
      this.formNoInstitucion.get('localidad_id').enable();
    }
  }

  seleccionDependencia(dependencia:Dependencia){
    this.dependenciaSeleccionada = dependencia;
  }

  seleccionLocalidad(localidad:Localidad){
    this.localidadSeleccionada = localidad;
  }

  async guardarSeleccion(){
    let accesoSeleccionado: AccesoPerfil;
    accesoSeleccionado = {
      'perfil': this.perfilSeleccionado,
      'colegio': null,
      'sede': null,
      'jornada': null,
      'localidad': this.localidadSeleccionada,
      'dependencia': this.dependenciaSeleccionada
    };
    this.accesoSeleccionado.emit(accesoSeleccionado);
  }

  cerrarSesion(){
    this.cerrar_sesion.emit()
  }
}
