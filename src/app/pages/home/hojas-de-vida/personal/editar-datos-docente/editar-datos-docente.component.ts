import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-editar-datos-docente',
  templateUrl: './editar-datos-docente.component.html',
  styleUrls: ['./editar-datos-docente.component.scss']
})
export class EditarDatosDocenteComponent {


  @ViewChild("modalExito") modalExito: any;
  @ViewChild("modalError") modalError: any;

  puedeVerAsignacion:boolean = false;
  esDocente:any;
  //Modal
  idUsuario:number = 0;
  formDatosDocete!: FormGroup;
  tiposIdentificacion:any = [];
  datosDocente:AccesoPerfil;

  cargandoInformacion:boolean = false;
  guardandoCorreo:boolean = false;
  esFotografia!:any;

  estaInactivo!:boolean;
  permisosCapturarFotografia:boolean = true;
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
    private servicioModal: NgbModal,
    private usuarioServices:UsuarioService,
    private router:Router
  ){
    this.construirFormularios();
    this.cargarListas();
    this.datosDocente = this.usuarioServices.obtenerAccesoSeleccionado();
    this.identficacionUsuario = this.usuarioServices.obtenerUsuario().id;
    this.obtenerDatos()
    this.cargarPermisos()
  }


  cargarPermisos(){
    this.usuarioServices.permisosActualizados$.subscribe((permisosActualizados) => {
      if (permisosActualizados) {
        this.puedeVerAsignacion = this.usuarioServices.obtetenerPermisosPerfil(PermisosUsuarios.PERSONAL_ASIGNACION_ACADEMICA)
      }
    })
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
      institucion: this.datosDocente.colegio ? this.datosDocente.colegio.id : null,
      sede: this.datosDocente.sede ? this.datosDocente.sede.id : null,
      jornada: this.datosDocente.jornada ? this.datosDocente.jornada.id : null,
    }

    console.log(parametos);

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

  verAsignacionAcademica(){
    this.router.navigate(['../home/hojas-de-vida/personal/asignacion-docente']);
  }
}
