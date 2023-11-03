import { AfterContentInit, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { MensajeModal } from '../mensaje-modal/mensaje-modal';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { last, lastValueFrom } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';


@Component({
  selector: 'app-nuevo-mensaje',
  templateUrl: './nuevo-mensaje.component.html',
  styleUrls: ['./nuevo-mensaje.component.scss']
})
export class NuevoMensajeComponent implements OnInit, AfterContentInit {

  @Output() tabActivo = new EventEmitter<any>();
  minDate: NgbDate;

  formularioMensajes!: FormGroup;


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '17rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold','backgroundColor']
    ],
    customClasses: []
  };

  listadoSedes: any;
  sede_id: any;
  colegio_id: any;
  localidad_id: any;
  jornada_id: any;
  perfil_id: any;
  usuarioLogueado: any;
  mensajeEditor: any;
  mensajeHtml: any;
  id_mensajeEditar: any;
  datosCargadosEditar: any;
  tipoUsuario: any = "Admin";

  fechaInicioMes: string = '';
  fechaActual: string = '';
  mensajeError: string = '';

  diasDiferencia!: number;

  campoNumericoTocado = false;
  actualizando = false;
  enviarMensaje = false;

  errorCampoMensajeVacio: boolean = false;
  cargarListadosPerfiles: boolean = false;
  cargarInfoLocalidades: boolean = false;
  cargarInfoColegios: boolean = false;
  cargarInfoJornadas: boolean = false;

  listadoLocalidades: any[] = [];
  listadoColegios: any[] = [];
  listadoJornadas: any[] = [];
  listadoPerfiles: any[] = [];

  colegiosXLocalidad: any[] = [];

  listadoFiltroColegio: any[];
  listadoFiltroLocalidad: any[];

  localidadesGuardadas: any[] = [];
  colegiosGuardados: any[] = [];
  sedesGuardados: any[] = [];
  jornadasGuardados: any[] = [];
  perfilesGuardados: any[] = [];

  infoUsuariologueado: any;
  datosUsuario: AccesoPerfil;
  deshabilitarBotonesAgregar: boolean = false;
  deshabilitarInputSelect: boolean = false;
  cargandoDatosRector: boolean;
  deshabilitarFechaInicio: boolean;
  deshabilitarFechaFin: boolean;
  cargandoLocalidadesNuevoMensaje: boolean;
  cargandoColegiosNuevoMensaje: boolean = false;
  cargandoColegiosEditarMensajes: boolean;
  cargandoInfoSedesEditar: boolean;
  deshabilitarLocalidadesFiltrar: boolean;
  desHabilitarColegios: boolean;
  desHabilitarColegiosFiltrar: boolean;
  desHabilitarSede: boolean;
  desHabilitarJornada: boolean;
  cargandoColegiosSelect: boolean;
  cargandoSedesSelect: boolean;
  puedeEnviarMensajes: any;


  constructor(private mensajesService: MensajesService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private servicioModal: NgbModal,
    private router: Router) {
    this.datosUsuario  = this.usuarioService.obtenerAccesoSeleccionado();
    this.puedeEnviarMensajes = this.usuarioService.obtetenerPermisosPerfil(PermisosUsuarios.ENVIAR_MENSAJES)
    const today = new Date();
    this.minDate = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate())

  }

  ngAfterContentInit(): void {

  }

  async ngOnInit() {
    this.construirFormulario();

    await this.cargarListados();

    this.infoUsuariologueado = this.usuarioService.obtenerUsuarioPerCol();
    console.log( this.infoUsuariologueado )
    this.usuarioLogueado = this.usuarioService.obtenerUsuario();


    this.activatedRoute.params.subscribe(params => {
      this.id_mensajeEditar = params['id'];
      if (this.id_mensajeEditar) {
        this.tipoUsuario = 'modoEditor';
        this.cargarMensaje(this.id_mensajeEditar);
      }
    });



    if (this.datosUsuario.perfil.id == 410 || this.datosUsuario.perfil.id == 460 || this.datosUsuario.perfil.id == 423 || this.datosUsuario.perfil.id == 421 || this.datosUsuario.perfil.id == 422 || this.datosUsuario.perfil.id == 420 || this.datosUsuario.perfil.id == 424) {
      this.cargarInfoRector()
    }

    if (this.datosUsuario.perfil.id == 110 && this.tipoUsuario == 'Admin') {
      // this.cargarInfoRector()
      this.deshabilitarLocalidadesFiltrar = true;
      this.desHabilitarColegios = true;
      this.desHabilitarColegiosFiltrar = true;
      this.desHabilitarSede = true;
      this.desHabilitarJornada = true;
      this.formularioMensajes.controls['colegio_id'].disable();
      this.formularioMensajes.controls['localidadFiltrar_id'].disable();
      this.formularioMensajes.controls['colegioFiltrar_id'].disable();
      this.formularioMensajes.controls['sede_id'].disable();
      this.formularioMensajes.controls['jornada_id'].disable();

    }
    if (this.datosUsuario.perfil.id == 110 && this.tipoUsuario == 'modoEditor') {
      this.deshabilitarLocalidadesFiltrar = false;
      this.desHabilitarColegios = false;
      this.desHabilitarColegiosFiltrar = false;
      this.desHabilitarSede = false;
      this.desHabilitarJornada = false;
      this.formularioMensajes.controls['colegio_id'].enable();
      this.formularioMensajes.controls['localidadFiltrar_id'].enable();
      this.formularioMensajes.controls['colegioFiltrar_id'].enable();
      this.formularioMensajes.controls['sede_id'].enable();
      this.formularioMensajes.controls['jornada_id'].enable();

    }


  }

  construirFormulario() {
    this.formularioMensajes = this.formBuilder.group({
      perfil_id: [null, [Validators.required]],
      localidad_id: [null,],
      localidadFiltrar_id: [null,],
      colegio_id: [null,],
      colegioFiltrar_id: [null,],
      sede_id: [null,],
      jornada_id: [null,],
      fecha_inicio: [Date, [Validators.required]],
      fecha_final: [Date, [Validators.required]],
      mensajeHtml: [null, [Validators.required]],
      info_asunto: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /**
 * Verifica si un campo es valido del formulario de plan
 * @param campo
 * @returns
 */
  campoNoValido(campo: string) {
    return this.formularioMensajes.get(campo)?.invalid && this.formularioMensajes.get(campo)?.touched;
  }

  async cargarInfoRector() {
    try {
      this.cargandoDatosRector = true;
      this.cargandoLocalidadesNuevoMensaje = true;
      this.cargandoColegiosNuevoMensaje = true;
      this.infoUsuariologueado = this.usuarioService.obtenerUsuarioPerCol();

      this.formularioMensajes.controls['localidad_id'].disable();
      this.formularioMensajes.controls['colegio_id'].disable();
      this.formularioMensajes.controls['localidadFiltrar_id'].disable();
      this.formularioMensajes.controls['colegioFiltrar_id'].disable();
      this.deshabilitarBotonesAgregar = true;
      this.deshabilitarInputSelect = true;

         console.log(this.listadoLocalidades)

      if (this.tipoUsuario === 'Admin') {

        this.formularioMensajes.patchValue({
          localidad_id: this.infoUsuariologueado.localidad.id,
          localidadFiltrar_id: this.infoUsuariologueado.localidad.id,
          colegio_id: this.infoUsuariologueado.colegio.id,
          colegioFiltrar_id: this.infoUsuariologueado.colegio.id
        });
        if (this.listadoLocalidades) {
          const localidadPromise = this.listadoLocalidades.map(async (localidad: any) => {
            if (this.infoUsuariologueado.localidad.id === localidad.id) {
              this.localidadesGuardadas.push(localidad);
              this.cargandoLocalidadesNuevoMensaje = false;
            }
          });
          this.agregarLocalidades();
          await Promise.all(localidadPromise)
        }


        const listaColegios$ = this.mensajesService.obtenerColegios(this.infoUsuariologueado.localidad.id);
        const colegios: any = await lastValueFrom(listaColegios$);
        this.colegiosXLocalidad[this.infoUsuariologueado.localidad.id] = colegios.data;
        if (colegios.length == 0) {
          this.listadoColegios = [{
            id: -1, nombre: 'SIN INFORMACION'
          }]
        } else {
          this.listadoColegios = [{ id: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...colegios.data];
        }

        const colegiosPromises = this.listadoColegios.map(async (colegio: any) => {
          if (this.infoUsuariologueado.colegio.id === colegio.id) {
            this.colegiosGuardados.push(colegio);
          }
        });
        await Promise.all(colegiosPromises);
        this.cargandoColegiosNuevoMensaje = false;
        this.listadoFiltroColegio = [...this.colegiosGuardados];
      }

      this.cargandoDatosRector = false;
    } catch (error) {
      this.cargandoDatosRector = false;
    }
  }

  cargarMensaje(id: any) {
    this.mensajesService.obtenerMensajeCompleto(id).subscribe(async (resp: any) => {

      this.datosCargadosEditar = resp.data;

      this.formularioMensajes.patchValue({
        info_asunto: resp.data.asunto,
        mensajeHtml: resp.data.contenido
      });

      // this.mensajeHtml = resp.data.contenido;

      this.obtenerFechas(resp.data)
      // this.obtenerElementosEditar(resp.data.perfiles, 'perfiles');
      await this.obtenerPerfilesEditar(resp.data.perfiles);

      this.cargarInfoLocalidades = true;

      await this.cargarLocalidadesColegios(resp.data.localidades, resp.data.colegios);

      if (this.datosUsuario.perfil.id == 110 && this.tipoUsuario == 'modoEditor') {
        this.formularioMensajes.controls['colegio_id'].enable();
      }

    })
  }

  async obtenerPerfilesEditar(elementos: any[]) {
    if (this.listadoPerfiles) {
      const promicePefiles = this.listadoPerfiles.map((perfil: any) => {
        elementos.map((elemento: any) => {
          if (elemento == perfil.id) {
            if (this.perfilesGuardados.find(x => x.id == perfil.id)) {

            } else {
              this.perfilesGuardados.push(perfil)
              this.cargarListadosPerfiles = false;
            }
            if (this.perfilesGuardados) {
              this.cargarListadosPerfiles = true;
            }
            if (this.tipoUsuario == 'modoEditor') {
              this.formularioMensajes.patchValue({
                "perfil_id": perfil.id
              })

            }
            // cargarListadosPerfiles
            // this.tipoUsuario = 'modoEditor'
          }
          this.cargarListadosPerfiles = true;
        })
      })
      await Promise.all(promicePefiles);
    }
  }

  // Ultimos cambios editar
  async cargarLocalidadesColegios(localidades: any[], colegios: any[]) {
    console.log(localidades)
    
    this.cargandoColegiosEditarMensajes = true;
    if (this.listadoLocalidades && localidades) {
      await this.listadoLocalidades.map((localidad: any) => {
        localidades.map(async (localidadGuardada: any) => {
          if (localidadGuardada == localidad.id) {
            if (!this.localidadesGuardadas.find(x => x.id == localidad.id)) {
              this.localidadesGuardadas.push(localidad);

              if (this.tipoUsuario == 'modoEditor') {
                this.formularioMensajes.patchValue({ localidad_id: localidad.id })
              }

              this.listadoFiltroLocalidad = [...this.localidadesGuardadas]

              this.cargandoColegiosEditarMensajes = true;
              await this.obtenerColegios(localidad.id);
              await this.cargarColegiosGuardados(colegios);
            }
          }
        })
      })
      this.cargarInfoLocalidades = true;
    }else{
      this.cargandoColegiosEditarMensajes = false
      this.cargandoInfoSedesEditar = false
      this.cargarInfoJornadas = false;
    }
  }

  // const listaColegios$ = this.mensajesService.obtenerColegios(localidad_id);

  async cargarColegiosGuardados(colegiosGuardadosId: any[]) {
    if (colegiosGuardadosId) {
      const promiceColegios = colegiosGuardadosId.map(async (colegioGuardadoId) => {
        const colegioGuardado = await this.obtenerColegioXLocalidad(colegioGuardadoId);
        if (!this.colegiosGuardados.find(x => x.id == colegioGuardado.id)) {
          this.colegiosGuardados.push(colegioGuardado)
          this.cargandoColegiosEditarMensajes = false;
          if (this.tipoUsuario == 'modoEditor') {
            this.formularioMensajes.patchValue({ colegio_id: this.colegiosGuardados[0].id })
            this.listadoFiltroColegio = [...this.colegiosGuardados]
          }
          this.cargandoInfoSedesEditar = true
          await this.cargarSedesGurdadas();
        }

      });

      await Promise.all(promiceColegios);
    }else{
      this.cargandoColegiosEditarMensajes = false
      this.cargandoInfoSedesEditar = false
      this.cargarInfoJornadas = false;
    }

  }

  obtenerColegioXLocalidad(colegioId: number) {
    let colegioEncontrado;
    if (this.colegiosXLocalidad.map) {
      this.colegiosXLocalidad.map((localidad) => {
        localidad.forEach((colegio) => {
          if (colegio.id == colegioId) {
            colegioEncontrado = colegio;
          }
        })
      })
      return colegioEncontrado;
    }
  }

  // const listaColegios$ = this.mensajesService.obtenerColegios(localidad.id);
  // const colegios:any = await lastValueFrom(listaColegios$);

  async cargarSedesGurdadas() {
    this.cargandoInfoSedesEditar = true
    if (this.colegiosGuardados) {
      const promiceSedes = this.colegiosGuardados.map(async (element: any) => {

        const listaSedes$ = this.mensajesService.obtenerSedes(element.id);
        const sedes: any = await lastValueFrom(listaSedes$);
        if (sedes.data.length > 0) {
          let datosSedes: any = [...sedes.data]
          datosSedes.map((sede: any) => {
            if (this.datosCargadosEditar.sedes) {
              this.datosCargadosEditar.sedes.map((sedeGuardada: any) => {
                if (sedeGuardada == sede.id) {
                  if (this.sedesGuardados.find(x => x.id == sede.id)) {
                    this.cargandoInfoSedesEditar = false;
                  } else {
                    this.sedesGuardados.push(sede)
                    this.obtenerJornadasEditar()
                    this.cargandoInfoSedesEditar = false;
                  }

                }
              })
            }
          })

        }
        if (this.sedesGuardados.length <= 0) {
          this.cargandoInfoSedesEditar = false;
          this.cargarInfoJornadas = false;
        }
      })

      await Promise.all(promiceSedes)
    }

  }

  async obtenerJornadasEditar() {

    this.cargarInfoJornadas = true;

    if (this.colegiosGuardados && this.sedesGuardados) {
      await this.colegiosGuardados.map(async (colegio: any) => {
        await this.sedesGuardados.map(async (sede: any) => {
          if (colegio.id && sede.id) {
            const listaJornadas$ = this.mensajesService.obtenerJornada(colegio.id, sede.id);
            const jonada: any = await lastValueFrom(listaJornadas$);
            let jornadas: any[] = [...jonada.data]
            jornadas.map((jornada: any) => {
              if (this.datosCargadosEditar.jornadas) {
                this.datosCargadosEditar.jornadas.map((elemento: any) => {
                  this.cargarInfoJornadas = false;
                  if (elemento == jornada.id) {
                    if (this.jornadasGuardados.find(x => x.id == jornada.id)) {
                      this.cargarInfoJornadas = false;
                    } else {
                      this.cargarInfoJornadas = false;
                      this.jornadasGuardados.push(jornada)
                    }
                  }
                })
              }
            })
          }
        })
      })

      if (this.jornadasGuardados.length <= 0) {
        this.cargarInfoJornadas = false;
      }
    }
  }

  async cargarListados() {

    // Listado perfiles
    await this.obtenerPerfiles();

    // Listado localidad
    await this.obtenerLocalidades();

  }

  // Peticiones a servicios

  obtenerPerfiles() {
    this.mensajesService.obtenerPerfiles().subscribe((resp: any) => {
      if (resp.data) {
        this.listadoPerfiles = [{ id: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...resp.data];
      }
      // {nombre:'Todos',id:''}
    })
  }

  async obtenerLocalidades() {
    const listaLocalidades$ = this.mensajesService.obtenerLocalidades();
    const localidades: any = await lastValueFrom(listaLocalidades$);
    if (localidades.data) {
      this.listadoLocalidades = [{ id: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...localidades.data];
    }

  }

  async obtenerColegios(localidad_id: any) {
    if (localidad_id != null) {
      const listaColegios$ = this.mensajesService.obtenerColegios(localidad_id);
      const colegios: any = await lastValueFrom(listaColegios$);
      this.colegiosXLocalidad[localidad_id] = colegios.data;
      if (colegios.length == 0) {
        this.listadoColegios = [{
          id: -1, nombre: 'SIN INFORMACION'
        }]
        this.cargandoColegiosNuevoMensaje = false;
      } else {
        if (colegios.data) {
          this.listadoColegios = [{ id: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...colegios.data];
        }
        this.cargandoColegiosNuevoMensaje = false;
      }
    }


    this.cargandoColegiosSelect = false;
  }

  async obtenerListadoSedes(id_colegio: any) {
    if (id_colegio != null) {
      const listadoSedes$ = this.mensajesService.obtenerSedes(id_colegio);
      const sedes: any = await lastValueFrom(listadoSedes$);
      if (this.tipoUsuario == "Admin") {
        if (sedes.length == 0) {
          this.listadoSedes = [{
            id: -1, nombre: 'SIN INFORMACION'
          }]
        } else {
          if (sedes.data.length < 2) {
            this.listadoSedes = [...sedes.data];
          } else {
            this.listadoSedes = [{ id: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...sedes.data];
          }
        }
      } else {
        this.listadoSedes = [{ id: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...sedes.data];
      }
    }
    this.cargandoSedesSelect = false;

  }

  obtenerJornada(sedes:any[]) {

    console.log(sedes)
    if (!this.colegio_id) {

    } else {

      try {
          for (const sede of sedes) {   
            this.mensajesService.obtenerJornada(this.colegio_id, sede.id).subscribe((resp: any) => {
  
              if (resp.data.length >= 0 && resp.data.length <= 1) {
                this.listadoJornadas = [...resp.data];
                this.formularioMensajes.controls['jornada_id'].enable();
                this.desHabilitarJornada = false;
              } else {
                this.listadoJornadas = [{ id: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...resp.data];
                this.formularioMensajes.controls['jornada_id'].enable();
                this.desHabilitarJornada = false;
              }
  
            }, (err) => {
            });
          }
        

      } catch (error) {
        // console.log("error")
      }
    }
  }

  // identificadores opciones listados

  perfilSeleccionado(infoPerfil: any) {
    if (infoPerfil != null) {
      this.perfil_id = infoPerfil.id;
    } else {
      this.perfil_id = '';
    }
  }

  async localidadSeleccionada(localidad_id: any, agregarListadoColegio: boolean = false) {
    if (localidad_id) {
      this.localidad_id = localidad_id;
    } else {
      this.localidad_id = ''
    }
    this.formularioMensajes.controls['colegio_id'].disable();
    this.formularioMensajes.get('colegio_id').reset();
    this.desHabilitarColegios = true;
    if (agregarListadoColegio) {
      if (this.tipoUsuario == 'Admin') {
        if (this.datosUsuario.perfil.id == 110) {
          this.cargandoColegiosSelect = true;
          if (localidad_id != null) {
            await this.obtenerColegios(localidad_id);
            this.desHabilitarColegios = false;
            this.cargandoColegiosSelect = false;
            this.formularioMensajes.controls['colegio_id'].enable();
          } else {
            this.desHabilitarColegios = true;
            this.formularioMensajes.controls['colegio_id'].disable();
            this.cargandoColegiosSelect = false;
          }
        }
      }
    }
    // if (this.tipoUsuario == 'Admin') {

    //   if (this.datosUsuario.perfil.id == 410) {
    //     // this.cargarInfoRector()
    //   }
    // }
  }

  async colegioSeleccionado(colegio_id: any, agregarListadoSedes: boolean = false) {
    this.colegio_id = colegio_id;
    if (this.tipoUsuario == 'Admin') {
      this.formularioMensajes.controls['sede_id'].disable();
      this.formularioMensajes.get('sede_id').reset();
    }
    this.desHabilitarSede = true;
    if (agregarListadoSedes) {
      this.cargandoSedesSelect = true;
      if (this.tipoUsuario == 'Admin') {
        if (colegio_id != null) {
          await this.obtenerListadoSedes(colegio_id);
          this.desHabilitarSede = false;
          this.formularioMensajes.controls['sede_id'].enable();
        } else {
          this.desHabilitarSede = true;
          this.formularioMensajes.controls['sede_id'].disable();
          this.cargandoSedesSelect = false;
        }
      } else {
        if (colegio_id != null) {
          await this.obtenerListadoSedes(colegio_id);
        }
      }
    }
  }

  sedeSeleccionada(sede_id: any) {
    this.formularioMensajes.get('jornada_id').reset();
    if (sede_id != null) {
      this.sede_id = sede_id;
      // this.obtenerJornada();
    } else {
      this.sede_id = '';
    }
  }

  jornadaSeleccionada(jornada_id: any) {
    this.jornada_id = jornada_id;
  }

  agregarLocalidades() {
    this.listadoFiltroLocalidad = [...this.localidadesGuardadas];
  }

  agregarColegios() {
    this.listadoFiltroColegio = [...this.colegiosGuardados];
  }

  // opciones de listado agregadas

  verificarSiExisteEnArray(array, objeto, nombreContenido) {
    // console.log(array, objeto)
    if (nombreContenido == 'etiqueta') {
      for (let i = 0; i < array.length; i++) {
        if (array[i].etiqueta == objeto.etiqueta) {
          return true;
          break;
        }
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        if (array[i].nombre == objeto.nombre) {
          return true;
          break;
        }
      }
    }
    return false;
  }

  async agregarOpcionSeleccionada(nombreListado: string) {



    switch (nombreListado) {

      case 'perfil':

        this.listadoPerfiles.map((perfil: any) => {
          if (this.perfil_id == perfil.id) {
            let elementoEnArray = this.verificarSiExisteEnArray(this.perfilesGuardados, perfil, 'etiqueta')

            if (!elementoEnArray) {
              if (perfil.etiqueta === "TODOS") {

                this.perfilesGuardados = this.listadoPerfiles;
                let indexPerfil = this.listadoPerfiles.findIndex(x => x.etiqueta === "TODOS");
                this.perfilesGuardados.splice(indexPerfil, 1);

              } else {
                let elementoEnArraydos = this.perfilesGuardados.includes(perfil);
                this.perfilesGuardados.push(perfil)
              }
            }
          }
        });
        if (this.datosUsuario.perfil.id) {
          this.obtenerPerfiles();
        }

        this.formularioMensajes.get('perfil_id').reset()
        this.formularioMensajes.get('perfil_id')?.clearValidators();
        this.formularioMensajes.get('perfil_id')?.setErrors(null);
        this.formularioMensajes.get('perfil_id')?.updateValueAndValidity();

        break;

      case 'localidad':

        this.listadoLocalidades.map((localidad: any) => {
          if (this.localidad_id == localidad.id) {
            let elementoEnArray = this.verificarSiExisteEnArray(this.localidadesGuardadas, localidad, 'nombre')
            // console.log(elementoEnArray)
            if (!elementoEnArray) {
              if (localidad.nombre === "TODOS") {

                let indexLocalidad = this.listadoLocalidades.findIndex(x => x.nombre === "TODOS");
                this.listadoLocalidades.splice(indexLocalidad, 1);

                let indexSinInfo = this.listadoLocalidades.findIndex(x => x.nombre === "SIN INFORMACION");
                this.listadoLocalidades.splice(indexSinInfo, 1);

                this.localidadesGuardadas = this.listadoLocalidades;

                this.deshabilitarLocalidadesFiltrar = false;
                this.formularioMensajes.controls['localidadFiltrar_id'].enable();

              } else {
                this.localidadesGuardadas.push(localidad)
                this.deshabilitarLocalidadesFiltrar = false;
                this.formularioMensajes.controls['localidadFiltrar_id'].enable();
              }
            }
          }
        });
        if (this.datosUsuario.perfil.id) {
          this.obtenerLocalidades();
        }

        this.formularioMensajes.get('localidad_id').reset()

        break;

      case 'colegio':

        this.listadoColegios.map(async (colegio: any) => {
          if (this.colegio_id == colegio.id) {
            let elementoEnArray = this.verificarSiExisteEnArray(this.colegiosGuardados, colegio, 'nombre')

            if (!elementoEnArray) {
              if (colegio.nombre === "TODOS") {

                let indexColegio = this.listadoColegios.findIndex(x => x.nombre === "TODOS");
                this.listadoColegios.splice(indexColegio, 1);

                let indexSinCole = this.listadoColegios.findIndex(x => x.nombre === "SIN INFORMACION");
                this.listadoColegios.splice(indexSinCole, 1);

                this.colegiosGuardados = this.listadoColegios;
                this.formularioMensajes.get('colegio_id').reset()

                if (this.tipoUsuario == 'Admin') {
                  if (this.datosUsuario.perfil.id == 110) {
                    this.desHabilitarColegiosFiltrar = false;
                    this.formularioMensajes.controls['colegioFiltrar_id'].enable();
                  }
                }

              } else {
                await this.colegiosGuardados.push(colegio)
                this.formularioMensajes.get('colegio_id').reset()


                if (this.tipoUsuario == 'Admin') {
                  if (this.datosUsuario.perfil.id == 110) {
                    this.desHabilitarColegiosFiltrar = false;
                    this.formularioMensajes.controls['colegioFiltrar_id'].enable();
                  }
                }
              }
            }
          }
        });
        if (this.datosUsuario.perfil.id) {
          // this.obtenerColegios();
          this.obtenerColegios(this.localidad_id);
        }

        if (this.datosUsuario.perfil.id != 110 && this.datosUsuario.perfil.id != 424) {
          // this.formularioMensajes.get('colegio_id').reset()
        }

        break;

      case 'sede':



        await this.listadoSedes.map((sede: any) => {
          if (this.sede_id == sede.id) {
            // let elementoEnArray = this.sedesGuardados.includes(sede);
            let elementoEnArray = this.verificarSiExisteEnArray(this.sedesGuardados, sede, 'nombre')

            if (!elementoEnArray) {
              if (sede.nombre === "TODOS") {

                let indexSede = this.listadoSedes.findIndex(x => x.nombre === "TODOS");
                this.listadoSedes.splice(indexSede, 1);
                this.sedesGuardados = this.listadoSedes;
                this.formularioMensajes.get('sede_id').reset()
                if (this.tipoUsuario == 'Admin') {
                  if (this.datosUsuario.perfil.id == 110) {
                    this.desHabilitarJornada = false;
                    this.formularioMensajes.controls['jornada_id'].enable();
                  }
                };
              } else {

                this.sedesGuardados.push(sede)
                this.formularioMensajes.get('sede_id').reset();
                if (this.tipoUsuario == 'Admin') {
                  if (this.datosUsuario.perfil.id == 110) {
                    this.desHabilitarJornada = false;
                    this.formularioMensajes.controls['jornada_id'].enable();
                  }
                };
              }

            }
          }

        });

        console.log(this.sedesGuardados)
        if(this.sedesGuardados.length > 0){
          this.formularioMensajes.controls['jornada_id'].enable();
          this.desHabilitarJornada = false;
        }

        if (this.datosUsuario.perfil.id) {
          // this.obtenerColegios();
          this.obtenerListadoSedes(this.colegio_id);
        }

        this.obtenerJornada(this.sedesGuardados);

        if (this.datosUsuario.perfil.id != 110 && this.datosUsuario.perfil.id != 424) {
          // this.formularioMensajes.get('sede_id').reset()
        }

        break;

      case 'jornada':



        this.listadoJornadas.map((jornada: any) => {
          if (this.jornada_id == jornada.id) {
            // let elementoEnArray = this.jornadasGuardados.includes(jornada);
            let elementoEnArray = this.verificarSiExisteEnArray(this.jornadasGuardados, jornada, 'nombre')

            if (!elementoEnArray) {


              if (jornada.nombre === "TODOS") {
                // console.log(jornada)

                let indexJornada = this.listadoJornadas.findIndex(x => x.nombre === "TODOS");
                this.listadoJornadas.splice(indexJornada, 1);

                this.jornadasGuardados = this.listadoJornadas;

              } else {

                this.jornadasGuardados.push(jornada)

              }

            }
          }


          // this.obtenerColegios();

        });
        if (this.sede_id != null) {
          this.mensajesService.obtenerJornada(this.colegio_id, this.sede_id).subscribe((resp: any) => {
            if (resp.data.length == 0) {
              this.listadoJornadas = [{
                id: -1, nombre: 'SIN INFORMACION'
              }]
              this.formularioMensajes.get('jornada_id').reset();

            } else {
              this.listadoJornadas = [{ id: -1, nombre: 'TODOS', etiqueta: 'TODOS' }, ...resp.data];
              this.formularioMensajes.get('jornada_id').reset();

            }
          }, (err) => {
            this.formularioMensajes.get('jornada_id').reset();

            // console.log(err)
          });
        }


        // asda

        break;

    }

  }

  eliminarOpcionListadoSelecionado(nombreListado: string, id: string) {

    switch (nombreListado) {

      case 'perfil':

        let indexPerfil = this.perfilesGuardados.findIndex(x => x.id === id);
        this.perfilesGuardados.splice(indexPerfil, 1);
        this.formularioMensajes.get('perfil_id').reset();
        this.perfil_id = '';


        break;

      case 'localidad':

        if (this.deshabilitarInputSelect == false) {
          let indexLocalidad = this.localidadesGuardadas.findIndex(x => x.id === id);
          this.localidadesGuardadas.splice(indexLocalidad, 1);
          this.localidadesGuardadas = this.localidadesGuardadas;

          if (this.datosUsuario.perfil.id == 110) {
            // this.cargarInfoRector()
            if (this.localidadesGuardadas.length <= 0) {
              this.deshabilitarLocalidadesFiltrar = true;
              this.formularioMensajes.controls['localidadFiltrar_id'].disable();
              this.formularioMensajes.get('localidadFiltrar_id').reset();
            }
          }

        }

        this.localidad_id = '';

        break;

      case 'colegio':

        if (this.deshabilitarInputSelect == false) {

          let indexColegio = this.colegiosGuardados.findIndex(x => x.id === id);
          this.colegiosGuardados.splice(indexColegio, 1);
          this.listadoFiltroColegio = this.colegiosGuardados;

          if (this.tipoUsuario == 'Admin') {
            if (this.datosUsuario.perfil.id == 110) {
              if (this.colegiosGuardados.length <= 0) {
                this.desHabilitarColegiosFiltrar = true;
                this.formularioMensajes.controls['colegioFiltrar_id'].disable();
                this.formularioMensajes.get('colegioFiltrar_id').reset();
              }
            }
          }

        }

        this.colegio_id = '';

        break;

      case 'sede':

        let indexSede = this.sedesGuardados.findIndex(x => x.id === id);
        this.sedesGuardados.splice(indexSede, 1);

        if (this.tipoUsuario == 'Admin') {
          if (this.datosUsuario.perfil.id == 110) {
            if (this.sedesGuardados.length <= 0) {
              this.desHabilitarJornada = true;
              this.formularioMensajes.controls['jornada_id'].disable();
              this.formularioMensajes.get('jornada_id').reset();
            }
          }
        }

        // this.formularioMensajes.get('sede_id').reset();

        this.sede_id = '';

        break;

      case 'jornada':

        this.jornada_id = '';

        let indexJornada = this.jornadasGuardados.findIndex(x => x.id === id);
        this.jornadasGuardados.splice(indexJornada, 1);


        break;

    }

  }

  obtenerFechas(data: any) {


    // fecha_inicio: [Date, [Validators.required]],
    // fecha_final: [
    let fechaFinalizacionArray = data.fecha_finalizacion.split('T')
    fechaFinalizacionArray = fechaFinalizacionArray[0].split('-')

    let fechainicioArray = data.fecha_inicio.split('T')
    fechainicioArray = fechainicioArray[0].split('-')

    this.formularioMensajes.patchValue({
      fecha_inicio: { year: + Number(fechainicioArray[0]), month: +Number(fechainicioArray[1]), day: +Number(fechainicioArray[2]) },
      fecha_final: { year: +Number(fechaFinalizacionArray[0]), month: +Number(fechaFinalizacionArray[1]), day: +Number(fechaFinalizacionArray[2]) }
    })

    this.validarFecha()

  };

  validarFecha() {

    const date = new Date();

    let fechaActual = this.formatearFecha(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1), 'date')

    let fechaInicio = this.formularioMensajes.get('fecha_inicio').value;
    let fechaFin = this.formularioMensajes.get('fecha_final').value;

    const fecha_inicio = this.formatearFecha(fechaInicio, "formateoObjeto")
    const fecha_fin = this.formatearFecha(fechaFin, "formateoObjeto")


    this.obtenerDistaniaFechas(fechaActual, fecha_inicio);
    if (this.diasDiferencia <= 0) {
      this.deshabilitarFechaInicio = true;
      this.formularioMensajes.controls['fecha_inicio'].disable();
    }

    this.obtenerDistaniaFechas(fechaActual, fecha_fin);
    if (this.diasDiferencia <= 0) {
      this.deshabilitarFechaFin = true;
      this.formularioMensajes.controls['fecha_final'].disable();
    }

  }


  // `${date.getFullYear()}-${date.getDate()}-${(date.getMonth() + 1)}`
  formatearFecha(fecha: any, tipoFormateo: any) {
    if (tipoFormateo == 'formateoObjeto') {
      return `${fecha.year}-${(fecha.month < 10 ? '0' : '').concat(fecha.month)}-${(fecha.day < 10 ? '0' : '').concat(fecha.day)}`;
    }
    if (tipoFormateo == 'date') {
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      return `${fecha.getFullYear()}-${(mes < 10 ? '0' : '').concat(mes)}-${(dia < 10 ? '0' : '').concat(dia)}`
    }
    return null
  };


  obtenerDistaniaFechas(fecha_inicio: any, fecha_final: any) {
    const fechaDesde = new Date(fecha_inicio);
    const fechaHasta = new Date(fecha_final);
    fechaDesde.setDate(fechaDesde.getDate() - 1);
    fechaHasta.setDate(fechaHasta.getDate() + 1);
    let diferenciaFechas = fechaHasta.getTime() - fechaDesde.getTime();
    this.diasDiferencia = (diferenciaFechas / 1000 / 60 / 60 / 24) - 1;
  }

  crearMensaje() {

    try {

      this.enviarMensaje = true;

      let datosUsuario:AccesoPerfil  = this.usuarioService.obtenerAccesoSeleccionado();

      const inicio = this.formularioMensajes.get('fecha_inicio')?.value;
      const final = this.formularioMensajes.get('fecha_final')?.value;

      const fecha_inicio = `${inicio.year}-${(inicio.month < 10 ? '0' : '').concat(inicio.month)}-${(inicio.day < 10 ? '0' : '').concat(inicio.day)}`;

      const fecha_final = `${final.year}-${(final.month < 10 ? '0' : '').concat(final.month)}-${(final.day < 10 ? '0' : '').concat(final.day)}`;

      this.obtenerDistaniaFechas(fecha_inicio, fecha_final);
      // mensajeHtml
      let mensajeHtml = this.formularioMensajes.get('mensajeHtml')?.value;

      const informacionMensaje = {
        "asunto": this.formularioMensajes.get('info_asunto')?.value, // listo
        "fecha_inicio": fecha_inicio, // listo
        "fecha_finalizacion": fecha_final, // listo
        "contenido": mensajeHtml,
        "enviado_por": 1, // listo
        "perfiles": this.crearArrayId(this.perfilesGuardados), // listo
        "localidades": this.crearArrayId(this.localidadesGuardadas), // listo
        "colegios": this.crearArrayId(this.colegiosGuardados), // listo
        "sedes": this.crearArrayId(this.sedesGuardados), // listo
        "jornadas": this.crearArrayId(this.jornadasGuardados)  // listo
      }

      // console.log(informacionMensaje)


      if (this.diasDiferencia > 0) {
        if (mensajeHtml!) {
          if (this.formularioMensajes.status == 'VALID') {

            this.errorCampoMensajeVacio = false;
            this.mensajesService.crearMensaje(this.usuarioLogueado.id, datosUsuario.perfil.id, informacionMensaje).subscribe((resp: any) => {

              let infoMensaje: any = {}
              console.log(resp)
              if (resp.body.code == "200") {
                this.enviarMensaje = false;
                infoMensaje.ventanaEnviado = true;
                infoMensaje.titulo = 'Mensaje enviado';
                infoMensaje.mensaje = resp.body.message;
                const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
                modalRef.componentInstance.infoMensaje = infoMensaje;
                this.tabActivo.emit(2);
                this.router.navigate(['./home/gestion-administrativa/enviar-mensajes'])
                // modalRef.result.then(() => {
                //   console.log('cerrado modal');
                // })
                return
              } else {
                this.formularioMensajes.markAllAsTouched();
                this.enviarMensaje = false;
                let infoMensaje: any = {}
                infoMensaje.ventanaEnviado = true;
                infoMensaje.titulo = 'Error';
                infoMensaje.mensaje = resp.body.message;
                const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
                modalRef.componentInstance.infoMensaje = infoMensaje;
                // modalRef.result.then(() => {
                //   console.log('cerrado modal');
                // })
                return
              }

            }, (err) => {
              this.formularioMensajes.markAllAsTouched();
              this.enviarMensaje = false;
              let infoMensaje: any = {}
              infoMensaje.ventanaEnviado = true;
              infoMensaje.titulo = 'Error';
              infoMensaje.mensaje = err.message;
              const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
              modalRef.componentInstance.infoMensaje = infoMensaje;
              // modalRef.result.then(() => {
              //   console.log('cerrado modal');
              // })
            });
            return
          } else {
            this.formularioMensajes.markAllAsTouched();
            this.enviarMensaje = false;
            let infoMensaje: any = {}
            infoMensaje.ventanaEnviado = true;
            infoMensaje.titulo = 'Error';
            infoMensaje.mensaje = 'Verifique que el formulario este bien diligenciado';
            const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
            modalRef.componentInstance.infoMensaje = infoMensaje;
            // modalRef.result.then(() => {
            //   console.log('cerrado modal');
            // })
          }
        } else {
          this.enviarMensaje = false;
          this.errorCampoMensajeVacio = true;
          this.formularioMensajes.markAllAsTouched();
          let infoMensaje: any = {}
          infoMensaje.ventanaEnviado = true;
          infoMensaje.titulo = 'Error';
          infoMensaje.mensaje = 'Campo mensajes obligatorio ';
          const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
          modalRef.componentInstance.infoMensaje = infoMensaje;
          // modalRef.result.then(() => {
          //   console.log('cerrado modal');
          // })
          return
        }
      } else {
        this.enviarMensaje = false;
        this.formularioMensajes.markAllAsTouched();
        let infoMensaje: any = {}
        infoMensaje.ventanaEnviado = true;
        infoMensaje.titulo = 'Error';
        infoMensaje.mensaje = 'Verifique que las fechas esten bien diligenciadas';
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = infoMensaje;
        // modalRef.result.then(() => {
        //   console.log('cerrado modal');
        // })
        return
      }


    } catch (error) {
      // console.log("error")
    }

  }


  actualizarMensaje() {

    this.validarFecha()

    this.actualizando = true;

    let datosUsuario:AccesoPerfil  = this.usuarioService.obtenerAccesoSeleccionado();
    const inicio = this.formularioMensajes.get('fecha_inicio')?.value;
    const final = this.formularioMensajes.get('fecha_final')?.value;

    const fecha_inicio = `${inicio.year}-${(inicio.month < 10 ? '0' : '').concat(inicio.month)}-${(inicio.day < 10 ? '0' : '').concat(inicio.day)}`;

    const fecha_final = `${final.year}-${(final.month < 10 ? '0' : '').concat(final.month)}-${(final.day < 10 ? '0' : '').concat(final.day)}`;

    this.obtenerDistaniaFechas(fecha_inicio, fecha_final);

    let mensajeHtml = this.formularioMensajes.get('mensajeHtml')?.value;
    const informacionMensaje = {
      "asunto": this.formularioMensajes.get('info_asunto')?.value, // listo
      "fecha_inicio": fecha_inicio, // listo
      "fecha_finalizacion": fecha_final, // listo
      "contenido": mensajeHtml,
      "enviado_por": 1, // listo
      "perfiles": this.crearArrayId(this.perfilesGuardados), // listo
      "localidades": this.crearArrayId(this.localidadesGuardadas), // listo
      "colegios": this.crearArrayId(this.colegiosGuardados), // listo
      "sedes": this.crearArrayId(this.sedesGuardados), // listo
      "jornadas": this.crearArrayId(this.jornadasGuardados)  // listo
    }
    // console.log(this.formularioMensajes.value)

    // if(this.perfilesGuardados){
    //   this.formularioMensajes.get('perfil_id')?.setErrors({Invalid: false})
    // }


    if (mensajeHtml!) {
      if (this.diasDiferencia > 0) {
        if (this.formularioMensajes.status == 'VALID') {

          this.errorCampoMensajeVacio = false;
          this.mensajesService.editarMensaje(this.id_mensajeEditar, this.usuarioLogueado.id, datosUsuario.perfil.id, informacionMensaje).subscribe((resp: any) => {
            let infoMensaje: any = {}

            if (resp.body.code == "200") {
              this.actualizando = false;
              infoMensaje.ventanaEnviado = true;
              infoMensaje.titulo = 'Mensaje actualizado';
              infoMensaje.mensaje = resp.body.message;
              const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
              modalRef.componentInstance.infoMensaje = infoMensaje;
              // modalRef.result.then(() => {
              //   console.log('cerrado modal');
              // })
              this.errorCampoMensajeVacio = false;
            } else {
              this.actualizando = false;
              this.formularioMensajes.markAllAsTouched();
              let infoMensaje: any = {}
              infoMensaje.ventanaEnviado = true;
              infoMensaje.titulo = 'Error';
              infoMensaje.mensaje = resp.body.message;
              const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
              modalRef.componentInstance.infoMensaje = infoMensaje;
              // modalRef.result.then(() => {
              //   console.log('cerrado modal');
              // })
              return
            }

          }, (err) => {
            this.actualizando = false;
            this.actualizando = false;
            this.formularioMensajes.markAllAsTouched();
            let infoMensaje: any = {}
            infoMensaje.ventanaEnviado = true;
            infoMensaje.titulo = 'Error';
            infoMensaje.mensaje = 'Verifique que las fechas esten bien diligenciadas';
            const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
            modalRef.componentInstance.infoMensaje = infoMensaje;
            return
          })

        } else {
          this.actualizando = false;
          this.formularioMensajes.markAllAsTouched();
          let infoMensaje: any = {}
          infoMensaje.ventanaEnviado = true;
          infoMensaje.titulo = 'Error';
          infoMensaje.mensaje = 'Verifique el fomulario este bien diligenciado';
          const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
          modalRef.componentInstance.infoMensaje = infoMensaje;
          // modalRef.result.then(() => {
          //   console.log('cerrado modal');
          // })
          return
        }

      } else {
        this.actualizando = false;
        this.formularioMensajes.markAllAsTouched();
        let infoMensaje: any = {}
        infoMensaje.ventanaEnviado = true;
        infoMensaje.titulo = 'Error';
        infoMensaje.mensaje = 'Verifique que las fechas esten bien diligenciadas';
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = infoMensaje;
        // modalRef.result.then(() => {
        //   console.log('cerrado modal');
        // })
        return
      }


    } else {
      this.actualizando = false;
      this.errorCampoMensajeVacio = true;
      this.formularioMensajes.markAllAsTouched();
      let infoMensaje: any = {}
      infoMensaje.ventanaEnviado = true;
      infoMensaje.titulo = 'Error';
      infoMensaje.mensaje = 'Campo mensajes obligatorio ';
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = infoMensaje;
      // modalRef.result.then(() => {
      //   console.log('cerrado modal');
      // })
      return
    }


  }

  crearArrayId(elementos: any[]): any {
    let elementosId: any[] = [];
    elementos.forEach((elemento: any) => {
      elementosId.push(elemento.id.toString());
    })
    return elementosId;
  }

  ngAfterViewInit() {

  }



}
function callback(arg0: boolean) {
  throw new Error('Function not implemented.');
}

