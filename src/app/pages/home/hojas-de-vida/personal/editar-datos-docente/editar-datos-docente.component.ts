import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalService } from 'src/app/services/api/personal/personal.service';

@Component({
  selector: 'app-editar-datos-docente',
  templateUrl: './editar-datos-docente.component.html',
  styleUrls: ['./editar-datos-docente.component.scss']
})
export class EditarDatosDocenteComponent {


  @ViewChild("modalExito") modalExito: any;
  @ViewChild("modalError") modalError: any;

  //Modal
  idUsuario:number = 0;
  formDatosDocete!: FormGroup;
  tiposIdentificacion:any = [];
  datosDocente:any;

  cargandoInformacion:boolean = false;
  guardandoCorreo:boolean = false;
  esFotografia!:any;

  estaInactivo!:boolean;
  identficacionUsuario!:string;
  fotoUsuario:string | any = ''
  urlFotoUsuario:string = ''
  mensajeError: string = ''

  parametrosFiltros = {
    sede: "",
    jornada: "",
    tipo_personal:"",
    identifacion:"",
    primer_nombre:"",
    segundo_nombre:"",
    primer_apellido:"",
    segundo_apellido:"",
    institucion: "",
  };

  constructor(
    private formBuilder:FormBuilder,
    private personalServices: PersonalService,
    private servicioModal: NgbModal
  ){
    this.construirFormularios();
    this.cargarListas();
    this.datosDocente = JSON.parse(sessionStorage.getItem('sap_sec_percol')!);
    this.identficacionUsuario = JSON.parse(sessionStorage.getItem('sap_sec_user')!).id
    this.obtenerDatos()
  }


  construirFormularios(){
    this.formDatosDocete = this.formBuilder.group({
      tipo_identificacion: [{value: '', disabled: true}],
      numero_identificacion: [{value: '', disabled: true}],
      apellidos: [{value: '', disabled: true} ],
      nombres: [{value: '', disabled: true}],
      cargo: [{value: '', disabled: true}],
      estado: [''],
      correo: ['', [ Validators.pattern('[a-z0-9._%+-]+@(educacionbogota.edu\\.co|educacionbogota\\.gov\\.co)$')
      , Validators.required]],
    })

  }

  campoNoValido(campo:string){
    return this.formDatosDocete.get(campo)?.touched && this.formDatosDocete.get(campo)?.invalid
  }


  cargarListas(){
    this.personalServices.obtenerPerfiles().subscribe({
      next: (respuesta:any) => {
        if(respuesta.code = 200){
          this.tiposIdentificacion = respuesta.data;
        }
      },
      error: (error) => console.log(error)
    })
  }

  obtenerDatos(){
    let parametos = {
      identificacion: this.identficacionUsuario,
      institucion: this.datosDocente.colegio.idColegio,
      sede: this.datosDocente.sede.idSede,
      jornada: this.datosDocente.jornada.idJornada,
    }
    this.cargandoInformacion = true
    this.personalServices.obtenerDatosSimple(parametos).subscribe({
      next: (respuesta:any) => {
        if(respuesta.status = 200){
          let datos = respuesta.data
          this.formDatosDocete.patchValue({
            tipo_identificacion: datos.tipoIdentificacion,
            numero_identificacion: datos.identificacion,
            apellidos: datos.primerApellido + ' ' + datos.segundoApellido,
            nombres: datos.primerNombre + ' ' + datos.segundoNombre,
            cargo: datos.cargo,
            estado: datos.estado,
            correo: datos.correo.toLowerCase()
          })
          if(datos.estado === "INACTIVO"){
            this.formDatosDocete.get("correo").disable;
            this.estaInactivo = true;
          }
          else{
            this.estaInactivo = false
          }
          this.urlFotoUsuario = datos.foto
          this.cargandoInformacion = false;
        }
        else{
          this.cargandoInformacion = false;
          console.log(respuesta.mensaje);
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  actualizarFoto(event:Event){
    this.fotoUsuario = event
  }

  esTomada(event:Event){
    this.esFotografia = event
  }

  actualizarCorreo(){
    if (this.formDatosDocete.invalid ) {
      Object.values(this.formDatosDocete.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
    else{
      this.guardandoCorreo = true;
      const parametros = {
        identificacion : this.identficacionUsuario,
        email: this.formDatosDocete.get("correo")?.value.trim()
      }
      this.personalServices.actualizarEmail(parametros).subscribe({
        next:(respuesta: any) => {
          if(respuesta.status === 200){
            if(this.fotoUsuario){
              let parametros = {
                es_fotografia: this.esFotografia ? '1' : '0' ,
                indentificacion: this.identficacionUsuario
              }
              const formDataImagen = new FormData();
              formDataImagen.append('photo', this.fotoUsuario)
              this.personalServices.actualizarFoto(parametros, formDataImagen).subscribe({
                next:(respuesta) => {
                  if(respuesta.status === 200){
                    this.servicioModal.open(this.modalExito,{ size: 'md', centered: true,  animation: false, backdrop: 'static', windowClass: 'modal_login'});
                    this.obtenerDatos()
                    this.guardandoCorreo = false
                  }
                },
                error: (error:any) => {
                  this.servicioModal.open(this.modalError,{ size: 'md', centered: true,  animation: false, backdrop: 'static', windowClass: 'modal_login'});
                  this.guardandoCorreo = false
                  this.mensajeError = 'No se pudo actualizar la foto'
                }
              })
            }
            else{
              this.servicioModal.open(this.modalExito,{ size: 'md', centered: true,  animation: false, backdrop: 'static', windowClass: 'modal_login'});
              this.guardandoCorreo = false
              this.mensajeError = ''
              this.obtenerDatos()
            }
          }
        },
        error:(error) => {
          if(error.status === 422){
            this.mensajeError = error.error.message
          }
          this.servicioModal.open(this.modalError,{ size: 'md', centered: true,  animation: false, backdrop: 'static', windowClass: 'modal_login'});
          this.guardandoCorreo = false
        }
      })
    }
  }
}
