import { Component, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { EliminarComponent } from './eliminar/eliminar.component';
import { CerrarComponent } from './cerrar/cerrar.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-editar-datos',
  templateUrl: './editar-datos.component.html',
  styleUrls: ['./editar-datos.component.scss']
})
export class EditarDatosComponent {

  @Input() public registro: any

  datosUsuario: any
  jornadas: any
  perfiles: any
  cargandoPerfiles: boolean = true;
  eliminandoPerfil: boolean = false;
  yaSeEncuentraPerfil: boolean = false;

  idColegio: number
  formDatosUsuario!: FormGroup;
  //Todo Reemplazar esta variable con el formulario
  perfilesAsociados: any;
  guardandoDatos: boolean = false;
  urlFoto: string = '';
  correoInicial: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private personalServices: PersonalService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
  ) {
    let datos_usuario = JSON.parse(sessionStorage.getItem('sap_sec_percol')!)
    this.idColegio = datos_usuario.colegio.idColegio;
    this.construirFormularios();
    this.cargarListas();
  }

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  construirFormularios() {
    this.formDatosUsuario = this.formBuilder.group({
      tipo_identificacion: [{ value: null, disabled: true }],
      numero_identificacion: [{ value: '', disabled: true }],
      apellidos: [{ value: '', disabled: true }],
      nombres: [{ value: '', disabled: true }],
      cargo: [{ value: '', disabled: true }],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@(educacionbogota.edu\\.co|educacionbogota\\.gov\\.co)$')
      ]],
      lista_perfiles: this.formBuilder.array([])
    })
  }

  campoNoValido(campo: string) {
    return this.formDatosUsuario.get(campo)?.touched && this.formDatosUsuario.get(campo)?.invalid
  }

  campoNoValidoEnFormArray(campo: string, indice: number): boolean {
    const formArray = this.formDatosUsuario.get('lista_perfiles') as FormArray;
    if (indice >= 0 && indice < formArray.length) {
      const elemento = formArray.at(indice) as FormGroup;
      return elemento.controls[campo].touched && elemento.controls[campo].invalid;
    }
    return false;
  }

  /**
   * Metodo que carga las listas necesarias.
   */
  cargarListas() {
    this.personalServices.obtenerPerfiles().subscribe({
      next: (respuesta: any) => {
        if (respuesta.status === 200) {
          this.perfiles = respuesta.data.map((perfil: any) => {
            return {
              ...perfil,
              codigo: parseInt(perfil.codigo)
            }
          })
        }
        else {
          console.log(respuesta.mensaje);
        }
      },
      error: (error) => console.log(error)
    })
  }

  /**
   * Retorna el array de listaFormularios
   */
  get listaPerfiles() {
    return this.formDatosUsuario.get('lista_perfiles') as FormArray;
  }

  /**
   * Metodo para actualizar los datos del usuario.
   */
  obtenerDatosUsuario() {
    this.formDatosUsuario.patchValue({
      tipo_identificacion: this.registro.tipoIdentificacion,
      numero_identificacion: this.registro.identificacion,
      apellidos: this.registro.apellidos,
      nombres: this.registro.nombres,
      cargo: this.registro.cargo,
      correo: this.registro.correo.toLowerCase()
    })
    this.correoInicial = this.registro.correo.toLowerCase();
    this.urlFoto = this.registro.foto
    this.obtenerPerfilUsuario()
  }

  /**
   * metodo que obtiene la informacion de los perfiles del usuario
   */
  obtenerPerfilUsuario() {
    this.cargandoPerfiles = true
    this.formDatosUsuario.get('lista_perfiles').markAsPristine();
    let parametros = {
      identificacion: this.registro.identificacion,
      institucion: this.idColegio
    }
    while (this.listaPerfiles.length > 0) {
      this.listaPerfiles.removeAt(0);
    }

    if(this.listaPerfiles.length === 0){
      this.personalServices.obtenerPerfilUsuario(parametros).subscribe(
        {
          next: (respuesta: any) => {
            if (respuesta.status === 200) {
              setTimeout(() => {
                let perfiles_usuarios = respuesta.data
                perfiles_usuarios.forEach((perfil: any) => {
                  this.agregarNuevoPerfil(perfil);
                })
                this.cargandoPerfiles = false

              }, 1000)
            }
            else{
              console.log(respuesta);
            }
          },
          error: (error: any) => {
            this.cargandoPerfiles = false
            console.log(error);
          }
        }
      )
    }
  }

  /**
 * Metodo que carga la jornada acorde a la seleccion de la sede
 * @param sedeSeleccionada
 */
  actualizarJornadas(sedeSeleccionada: any, perfilIndex: number){
    const perfil = this.listaPerfiles.at(perfilIndex);
    //Reiniciar valores
    perfil.get('cod_jornada')?.setValue(null);
    perfil.get('cod_jornada')?.enable();
    perfil.get('cod_jornada')?.setErrors({noSede: false});
    this.limpiarPerfil(perfilIndex);

    const jornadasArray = perfil.get('jornadas') as FormArray;
    while (jornadasArray.length > 0) {
      jornadasArray.removeAt(0);
    }
    const codSedeSeleccionada = sedeSeleccionada.codigo;

    let parametros = {
      id_colegio: this.idColegio,
      id_sede: codSedeSeleccionada
    }
    this.personalServices.obtenerJonadaPorSede(parametros).subscribe({
      next: (respuestaJornadas: any) => {
        const jornadas = respuestaJornadas.body.data;
        jornadas.forEach((jornada: any) => {
          let jornadaFormGroup = this.formBuilder.group({
            id: [jornada.id],
            nombre: [jornada.nombre],
          });
          jornadasArray.push(jornadaFormGroup);
          this.cargandoPerfiles = false
        });
      }
    })
  }

  /**
   * Metodo que devuelve un control para crear nuevo perfil
   */
  nuevoPerfil(perfil: any = []) {
    let jerCodigo: any = null
    let codInstitucion: any = null
    let codSede: any = null
    let codJornada: any = null
    let identificacion: any = null
    let codPerfil: any = null
    let estado: any = null
    let seleccionado: any = false
    if (perfil) {
      if (perfil.jerCodigo !== undefined || perfil.jerCodigo !== null) jerCodigo = perfil.jerCodigo
      if (perfil.codInstitucion !== undefined || perfil.jerCodigo !== null) codInstitucion = perfil.codInstitucion
      if (perfil.codSede !== undefined || perfil.jerCodigo !== null) codSede = perfil.codSede
      if (perfil.codJornada !== undefined || perfil.jerCodigo !== null) codJornada = perfil.codJornada
      if (perfil.identificacion !== undefined || perfil.jerCodigo !== null) identificacion = perfil.identificacion
      if (perfil.codPerfil !== undefined || perfil.jerCodigo !== null) codPerfil = perfil.codPerfil
      if (perfil.estado !== undefined || perfil.jerCodigo !== null) estado = perfil.estado
    }
    let formGroup = this.formBuilder.group({
      jer_codigo: [jerCodigo],
      cod_institucion: [codInstitucion],
      cod_sede: [codSede, Validators.required],
      cod_jornada: [codJornada, Validators.required],
      identificacion: [identificacion],
      cod_perfil: [codPerfil, Validators.required],
      estado: [estado],
      seleccionado: [seleccionado],
      sedes: this.formBuilder.array([]),
      jornadas: this.formBuilder.array([]),
    });

    this.personalServices.obtenerSedes(this.idColegio).subscribe({
      next: (sedesRespuesta: any) => {
        let sedesJornadasArray = formGroup.get('sedes') as FormArray;
        sedesRespuesta.forEach((sede: any) => {
            let sedeFormGroup = this.formBuilder.group({
              codigo: [sede.codigo],
              nombre: [sede.nombre],
            });
            sedesJornadasArray.push(sedeFormGroup);
        })
      },
      error: (error) => console.log(error)
    })

  if (codSede){
    let parametros = {
      id_colegio: this.idColegio,
      id_sede: codSede
    }
    this.personalServices.obtenerJonadaPorSede(parametros).subscribe({
      next: (respuestaJornadas: any) => {
        let jornadasArray = formGroup.get('jornadas') as FormArray;
        const jornadas = respuestaJornadas.body.data;
        jornadas.forEach((jornada: any) => {
          //Creamos el form group de jornadas para el sedesFormGrop.jornda
          let jornadaFormGroup = this.formBuilder.group({
            id: [jornada.id],
            nombre: [jornada.nombre],
          });
          //Guardamos las jornadas por cada sede
          jornadasArray.push(jornadaFormGroup);
          this.cargandoPerfiles = false
        });
      }
    })
  }
    else if (!codSede && !codPerfil){
      let control = formGroup.get("cod_jornada")
      control?.disable();
      control?.setErrors({ noSede: true });
    }
    return formGroup;
  }


  /**
  * Metodo que agrega una perfil
  */
  agregarNuevoPerfil(perfil: any = null) {
    this.listaPerfiles.push(this.nuevoPerfil(perfil));
  }


  /**
   * Metodo que cuenta cuantas veces esta un perfil en las listas
   * @param perfil
   * @returns
   */
  contarPerfiles(perfil: any) {
    let conteo = 0;
    this.listaPerfiles.controls.forEach((item: any) => {
      if (item.controls.cod_perfil.value  &&
        item.controls.cod_jornada.value == perfil.cod_jornada &&
        item.controls.cod_sede.value == perfil.cod_sede
      ) {
        conteo++
      }
    });
    return conteo;
  }

  /**
 * Metodo que valida si ya existe un perfil
 * @param perfil
 * @returns
 */
  perfilRepetido(perfil: any) {
    if (this.contarPerfiles(perfil) > 1) {
      return true
    }
    else {
      return false
    }
  }

  /**
   * Metodo para validar el perfil si existe o no existe
   * @param perfil
   */
  seleccionarPerfil(perfilIndex: any) {
    let perfil = this.listaPerfiles.at(perfilIndex)?.value
    if (perfil.cod_jornada === "" || perfil.cod_sede === "" ||
      perfil.cod_jornada === null || perfil.cod_sede === null) {
      const modalError = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true })
      modalError.componentInstance.informacion = {
        error: true,
        esExitoso: 'error',
        titulo: '¡Error!',
        mensaje: 'Debe seleccionar sede y/o jornada, antes de elegir un perfil'
      }
      this.listaPerfiles.at(perfilIndex).get('cod_perfil')?.setValue(null)
    }
    else {
      if (this.perfilRepetido(perfil)) {
        const modalError = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true })
        modalError.componentInstance.informacion = {
          error: true,
          esExitoso: 'error',
          titulo: '¡Error!',
          mensaje: 'No se puede agregar el perfil, debido a que este perfil ya se encuentra asociadio en esta sede y/o jornada'
        }
        this.listaPerfiles.at(perfilIndex).get('cod_perfil')?.setValue(null)
      }
    }
  }

  /**
   * Metodo que limpia el perfil al momento
   * de seleccionar la jornad para que no se repita
   */
  limpiarPerfil(perfilIndex: any) {
    this.listaPerfiles.at(perfilIndex).get('cod_perfil')?.setValue(null)
  }

  /**
   * Metodo que marca lso controles de un formArray
   * @param formArray
   */
  marcarControlesComoTocados(formArray: FormArray) {
    formArray.controls.forEach((formGroup: any) => {
      // Recorre los controles internos del FormGroup
      Object.values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    });
  }

  /**
   * Metodo que guarda la informacion acrode al formulario,
   * validando que campos han sido editados para guardar dicha informacion
   */
  guardar() {
    if (this.formDatosUsuario.invalid) {
      Object.values(this.formDatosUsuario.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      this.marcarControlesComoTocados(this.listaPerfiles);
    }
    else {
      this.guardandoDatos = true;
      let correo = this.formDatosUsuario.get('correo')?.value.toLowerCase().trim()
      if (this.correoInicial != correo) {
        this.actualizarCorreo();
      }
      if (this.formDatosUsuario.get('lista_perfiles')?.dirty) {
        this.actualizarPerfiles();
      }
      if (this.correoInicial === correo && !this.formDatosUsuario.get('lista_perfiles')?.dirty) {
        this.guardandoDatos = false;
        const modalError = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true })
        modalError.componentInstance.informacion = {
          esExitoso: 'warning',
          titulo: '¡Advertencia!',
          mensaje: 'No hay cambios por guardar.'
        }
      }
    }
  }

  /**
   * Meotodo para ctualizar el correo,
   * Valida si tambien se actualizo la lista de perfiles y en caso dado
   * va y la actualiza
   */
  actualizarCorreo() {
    const parametros = {
      identificacion: this.formDatosUsuario.get('numero_identificacion')?.value,
      email: this.formDatosUsuario.get("correo")?.value.toLowerCase().trim()
    }
    this.personalServices.actualizarEmail(parametros).subscribe({
      next: (respuesta: any) => {
        if (respuesta.status === 200) {
          if (this.formDatosUsuario.get('lista_perfiles')?.dirty) {
            this.actualizarPerfiles();
          }
          else {
            const modalExito = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true })
            modalExito.componentInstance.informacion = {
              error: false,
              esExitoso: 'done',
              titulo: '¡Exito!',
              mensaje: 'Información actualizada correctamente'
            }
            this.guardandoDatos = false;
            this.formDatosUsuario.get('correo')?.setValue(parametros.email);
          }
        }
      },
      error: (error) => {
        if (error.status == 422) {
          const modalError = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true })
          modalError.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: '¡Error!',
            mensaje: error.error.message
          }
          this.formDatosUsuario.get('correo')?.setValue(this.registro.correo);
          this.guardandoDatos = false;

        }
        else {
          const modalError = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true })
          modalError.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: '¡Error!',
            mensaje: 'No se pudo actualizar la información'
          }
          this.formDatosUsuario.get('correo')?.setValue(this.registro.correo);
          this.guardandoDatos = false;
        }
      }
    })
  }



  /**
   * Metodo para actualizar los perfiles
   */
  actualizarPerfiles() {
    let errorEncontrado = false;
    const observables: any[] = [];
    for (let i = 0; i < this.listaPerfiles.controls.length; i++) {
      const perfil = this.listaPerfiles.controls[i];
      const jerCod = perfil.get('jer_codigo')?.value
      if(!jerCod){
        let parametros_perfil = {
          codInstitucion: this.idColegio,
          sedCodigo: perfil.get('cod_sede')?.value,
          jerJorn: perfil.get('cod_jornada')?.value,
          codPerfil: perfil.get('cod_perfil')?.value,
          activo: 1,
          numeroDocumento: this.formDatosUsuario.get('numero_identificacion')?.value
        }
        observables.push(this.personalServices.guardarPerfil(parametros_perfil));
      }
      if(jerCod && perfil.dirty){
        let parametros_perfil = {
          codJerarquia: jerCod,
          codInstitucion: this.idColegio,
          sedCodigo: perfil.get('cod_sede')?.value,
          jerJorn: perfil.get('cod_jornada')?.value,
          codPerfil: perfil.get('cod_perfil')?.value,
          activo: 1,
          numeroDocumento: this.formDatosUsuario.get('numero_identificacion')?.value
        }
        observables.push(this.personalServices.actualizarPerfil(parametros_perfil))
      }
    }
    if (observables.length > 0) {
      forkJoin(observables).subscribe({
      next: (respuestas: any[]) => {
        let errorEncontrado = false;
        let errorDuplicado = false;
        for (const respuesta of respuestas) {
          if (respuesta.status != 200) {
            errorEncontrado = true;
            this.guardandoDatos = false

          }
          if(respuesta.status === 207){
            errorEncontrado = true;
            errorDuplicado = true;
          }
        }
        if (!errorEncontrado) {
          // Mostrar mensaje de éxito una vez que todas las solicitudes hayan terminado.
          const modalExito = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
          modalExito.componentInstance.informacion = {
            error: false,
            esExitoso: 'done',
            titulo: '¡Éxito!',
            mensaje: 'Información actualizada correctamente'
          }
          this.guardandoDatos = false
          this.activeModal.close(true)
        }
        else if(errorDuplicado){
          const modalError = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
          modalError.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: '¡Error, no se pudo guardar cambios.!',
            mensaje:  'Ya existe(n) un(os) perfil(es) con los datos suministrados'
          };
         this.guardandoDatos = false
        }
      },
      error: (error) => {
        // Mostrar mensaje de error si ocurre un error en alguna de las solicitudes.
        const modalError = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
        modalError.componentInstance.informacion = {
          error: true,
          esExitoso: 'error',
          titulo: '¡Error!',
          mensaje: 'No se pudo guardar la información'
        };
        this.guardandoDatos = false
      },
      complete: () => {
        this.guardandoDatos = false;
      }
    });
    }
  }

  /**
   * Metodo para cerrar el modal
   */
  cancelar(){
    if(this.formDatosUsuario.dirty){
      const modalCerrar = this.modalService.open(CerrarComponent, {size:'md', centered: true, animation: false, backdrop: 'static'})
      modalCerrar.result.then((result:any) => {
        if(result){
          this.activeModal.close(false)
        }
      })
    }
    else{
        this.activeModal.close(false)
    }
  }

    /**
   * Metodo que cuenta cuantas veces esta un perfil en las listas
   * @param perfil
   * @returns
   */
    contarSeleccionados() {
      let conteo = 0;
      this.listaPerfiles.controls.forEach((item: any) => {
        if (item.controls.seleccionado.value == true
        ) {
          conteo++
        }
      });
      return conteo;
  }

  /**
   * Metodo que habilita el modal para elimiar perfiles
   * validando si ha seleccioando o no
   * acorde a si esta seleccionado o no
   */
  abrirModalEliminarPerfil(){
    let estan_todos:number = 0;
    let cambios_sin_guardar:boolean = false
    this.listaPerfiles.controls.forEach((perfil) => {
      estan_todos = this.contarSeleccionados()
      let codigo_jer = perfil.get('jer_codigo')?.value
      if(codigo_jer === '' || codigo_jer === undefined){
        cambios_sin_guardar = true;
      }
    });

    if(estan_todos === this.listaPerfiles.length){
      const modalError = this.modalService.open(ModalInformacionComponent, { size: 'md', animation: false, backdrop: 'static', centered: true })
      modalError.componentInstance.informacion = {
        esExitoso: 'feedback',
        titulo: 'Error al eliminar el perfil de funcionario',
        mensaje: 'Debe dejar al menos un perfil para el usuario'
      }
    }
    else if(cambios_sin_guardar){
      const modalError = this.modalService.open(ModalInformacionComponent, { size: 'md', animation: false, backdrop: 'static', centered: true })
      modalError.componentInstance.informacion = {
        esExitoso: 'feedback',
        titulo: 'Error al eliminar el perfil de funcionario',
        mensaje: 'Debe guardar primero cambios antes de eliminar'
      }
    }
    else{
      let esta_seleccionado = this.listaPerfiles
        .controls.some((control: any) => {
          const seleccionado = control.get('seleccionado');
          return seleccionado && seleccionado.value === true;
        });
      if (esta_seleccionado) {
        const modalEliminar = this.modalService.open(EliminarComponent, { size: 'md', animation: false, backdrop: 'static', centered: true })
        modalEliminar.result.then((result: any) => {
          if (result){
              this.eliminarPerfil()
          }
        })
      }
      else {
        const modalError = this.modalService.open(ModalInformacionComponent, { size: 'md', animation: false, backdrop: 'static', centered: true })
        modalError.componentInstance.informacion = {
          esExitoso: 'feedback',
          titulo: 'Error al eliminar el perfil de funcionario',
          mensaje: 'Debe seleccionar al menos un perfil a eliminar para el funcionario seleccionado.'
        }
      }
    }
  }




  /**
   * Metodo que elimina el perfil
   * acorde de si esta seleccionado o no
   */
  eliminarPerfil() {
    this.eliminandoPerfil = true
    let observables = []
    for (let i = 0; i < this.listaPerfiles.controls.length; i++) {
      const perfil = this.listaPerfiles.controls[i];
      const seleccionado = perfil.get('seleccionado');
      if (seleccionado && seleccionado.value === true) {
        const codigoJerarquico = perfil.get('jer_codigo').value
        if (codigoJerarquico){
          let parametros = {
            codigo_jerarquico: codigoJerarquico,
            identificacion: this.formDatosUsuario.get("numero_identificacion")?.value,
          }
          observables.push(this.personalServices.eliminarPerfil(parametros))
        }
        else {
          this.eliminandoPerfil = false
          this.listaPerfiles.removeAt(i)
        }
      }

    }
    if (observables.length > 0) {
      forkJoin(observables).subscribe({
      next: (respuestas: any[]) => {
        let errorEncontrado = false;
        for (const respuesta of respuestas) {
          if (respuesta.status != 200) {
            errorEncontrado = true;
          }

        }
        if (!errorEncontrado) {
          const modalExito = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
          modalExito.componentInstance.informacion = {
            error: false,
            esExitoso: 'done',
            titulo: '¡Éxito!',
            mensaje: 'El perfil o los perfiles fueron eliminados correctamente'
          }
          this.obtenerPerfilUsuario()
        }
      },
      error: (error) => {
        // Mostrar mensaje de error si ocurre un error en alguna de las solicitudes.
        const modalError = this.modalService.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
        modalError.componentInstance.informacion = {
          error: true,
          esExitoso: 'error',
          titulo: 'Error al eliminar el perfil de funcionario',
          mensaje: 'No se pudo eliminar el perfil'
        };
        this.eliminandoPerfil = false
      },
      complete: () => {
        this.eliminandoPerfil = false;
      }
    });
    }
  }


}

