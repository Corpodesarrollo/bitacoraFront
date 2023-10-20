import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MsalService } from '@azure/msal-angular';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { ErrorInicioComponent } from '../error-inicio/error-inicio.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmarCerrarSesionComponent } from 'src/app/components/confirmar-cerrar-sesion/confirmar-cerrar-sesion.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seleccionar-perfil',
  templateUrl: './seleccionar-perfil.component.html',
  styleUrls: ['./seleccionar-perfil.component.scss']
})

export class SeleccionarPerfilComponent implements OnInit {
  /* Ng-select */
  @ViewChild('selectCol') private selectCol?: NgSelectComponent;
  @ViewChild('selectSede') private selectSede?: NgSelectComponent;
  @ViewChild('selectJornada') private selectJornada?: NgSelectComponent;

  /* Perfiles de administrador */
  perfilAdmin = 'adminsec'

  rolRector: any;
  cantRector: any;
  registroCol: any;
  perfilRector: any;
  colegiosRector: any;
  cantPerfiles: number = 0;
  perfilesUsuario: any;
  validarPerfiles: any;
  perfilUsuario: any;
  tieneMasPerfiles: boolean = false;
  arregloPerfiles: any;
  arregloCol: any;
  cargaExitosa: boolean = true;
  cargandoPerfil: boolean = true;
  titulos: any;
  tituloSeleccionado: any;
  cargando: boolean = false;
  registros: boolean = false;

  radioSeleccionado: boolean = false;
  colegioSeleccionado: any;

  registroSeleccionado: any;
  opcionSeleccionada: string = '';

  select1Value: any;
  select2Value: any;

  colegioPorDefecto: string = '';

  infoUsuario: any; /* Objeto con "registros" */
  idUsuario: any; /* Id de usuario */
  respuesta: any; /* Verifica si respuesta es exitosa */

  /* Variables Matriz Selección */
  jornadaSeleccionada: string = '';
  registroFiltrado: any[] = [];
  sinJornada: boolean = false;

  /* Parámetros ng-select*/
  ngSelectEnabled: boolean = false;
  listaInstituciones: any;
  sedeFiltrada: any[] = [];
  jornadaFiltrada: any[] = [];

  /* PlaceHolders ng-select */
  placeHolderColegio: string = "Seleccione el colegio";

  /* Parámetros para método de guardar en sessionStorage*/
  colegioGuardado: string = '';
  SedeGuardada: string = '';
  jornadaGuardada: string = '';
  foto_escudo: any;
  rolGuardado: string = '';
  etiquetaGuardada: string = '';
  idColegio: number = 0;
  idSede: number = 0;
  idJornada: number = 0;
  idPerfil: number = 0;
  localidadNombre: string ="";
  idLocalidad: number = 0;

  /* Formulario */
  formulario!: FormGroup;
  nombreColegio: string = '';
  nombreSede: string = '';
  nombreJornada: string = '';
  selecciones: boolean = true;
  mostrarError: boolean = false;

  institutoGuardado: string[] = [];   /* Variable para borrar sessionStorage*/
  esMicrosoft: boolean = false; /* Microsoft LogOut */
  slides: any[] = []; /* Imagenes Slides */
  ingresando: boolean = false;
  estaRecargando = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private authService: MsalService,
    private servicioModal: NgbModal
  ) {
    this.idUsuario = this.usuarioService.obtenerUsuario().id;
    this.validarCarga();
    this.construirFormularios();
    this.cargarImagenes();
  };

  @HostListener('window:beforeunload', ['$event'])
  cargarNotificacion(event: any): void {
    let es_desarrollo = environment.es_desarrollo
    if (!this.estaRecargando && !es_desarrollo) {
      const mensaje = '¿Seguro que deseas cerrar la sesión?';
      event.returnValue = mensaje
      localStorage.clear()
      sessionStorage.clear()
    }
  }

  @HostListener('window:keydown', ['$event'])
  cambioEstadoRecargaF(event: KeyboardEvent): void {
    if (event.key === 'F5') {
      this.estaRecargando = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  cambioEstadoRecarga(event: KeyboardEvent): void {
    if (event.key === 'F5') {
      this.estaRecargando = true;
    }
  }


  ngOnInit(): void {

    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
    if (sessionStorage.getItem('sap_sec_percol')) {
      this.router.navigate(['home'])
    }

    if (this.esMicrosoft) {
      this.idUsuario = this.usuarioService.obtenerUsuario().id;
      this.ObtenerInfoUsuario();
    }

    this.institutoGuardado = this.usuarioService.obtenerPerfilUsuario(); /* Obtiene información guardada usuario*/
  };


  validarCarga() {
    if (this.idUsuario && !this.esMicrosoft) {
      this.ObtenerInfoUsuario();
      this.cargando = true;
    }
  }

  cargarImagenes() {
    const numeroImagenes = 59; // Imagenes en carpeta
    const ruta = "assets/img/slides_acceso_perfil/";
    for (let i = 1; i <= numeroImagenes; i++) {
      const url = ruta + 'img-' + i + '.jpg';
      this.slides.push({ url });
    }
  }

  /* Inicializa formulario/validadores */
  construirFormularios() {
    this.formulario = this.formBuilder.group({
      nombreColegio: [null, Validators.required],
      nombreSede: [null, Validators.required],
      nombreJornada: [null, Validators.required]
    });
  }

  /* Verifica campos válidos */
  campoNoValidoFormulario(campo: string) {
    return this.formulario.get(campo)?.invalid && this.formulario.get(campo)?.touched;
  }

  /* Limpiar NgSelect */
  limpiarSeleccion(ngSelect?: NgSelectComponent) {
    if (ngSelect) {
      ngSelect.clearModel();
    }
  }

  ObtenerInfoUsuario() {
    if (this.usuarioService.obtenerInfoGuardada() == null) {
      this.usuarioService.obtenerInfoUsuario(this.idUsuario).subscribe({
        next: (data: any) => {
          if (data.exito) {
            this.respuesta = data;
            this.cargarListas(this.respuesta)
            this.usuarioService.guardarInfoCargada(data)
          } else if (data.exito === false) {
            this.cargandoPerfil = false;
            this.perfilUsuario = '';
          }
          else if (data.registros === null) {
            sessionStorage.clear();
            sessionStorage.removeItem('sap_sec_office365');
            this.usuarioService.removerUsuario();
            const modalRef = this.servicioModal.open(ErrorInicioComponent, { size: '602px', centered: true, animation: false, backdrop: 'static' });
            if (this.esMicrosoft) {
              modalRef.componentInstance.usuarioNoEncontrado = true;
              modalRef.result.then(() => {
                this.authService.logout({});
                modalRef.componentInstance.usuarioNoEncontrado = true;
              })
            }
            else {
              modalRef.componentInstance.usuarioNoEncontrado = false;
              modalRef.result.then(() => {
                this.usuarioService.cerrarSesion(false);
              })
            }
          }
        },
        error: (error: any) => {
          console.error(error);
        }
      })

    } else if (this.usuarioService.obtenerInfoGuardada() !== null) {
      const datos = this.usuarioService.obtenerInfoGuardada()
      this.cargaExitosa = true
      this.cargandoPerfil = true;
      setTimeout(() => {
        this.cargarListas(datos);
      }, 250);
    }
  }

  //Crea lista objetos colegio//
  cargarListas(response: any) {
    this.cargaExitosa = false;
    this.cargandoPerfil = false;
    this.infoUsuario = response.registros
    this.usuarioService.guardarInfoCargada(response)
    let perfilesUsuario = this.infoUsuario.map((item: any) => item.perfil);
    this.cantPerfiles = perfilesUsuario.length;
    this.perfilRector = perfilesUsuario;
    this.validarPerfiles = perfilesUsuario.map((perfil: any) => perfil.nombre).reduce((obj: any, item: any) => {
      if (!obj[item]) {
        obj[item] = 1;
      } else {
        obj[item] = obj[item] + 1;
      }
      return obj;
    }, {})

    this.obtenerPerfiles();
    this.obtenerColegiosRector();

    if (Object.keys(this.validarPerfiles).length === 1) {
      for (const [key, value] of Object.entries(this.validarPerfiles)) {
        let perfil = key.toLowerCase()
        this.registroCol = Object.keys(this.validarPerfiles)
        /* Caso perfil = rector y solo tiene un colegio, una sede y una jornada */
        if (this.cantRector === 1 && this.rolRector == "rector") {
          this.rectorUnicoRegistro()
        }
        /* Caso perfil Rector */
        else if (this.cantRector > 1 && this.rolRector == "rector") {
          /*Caso rector con un solo colegio*/
          if (this.arregloCol.length === 1) {
            this.listaInstituciones = this.arregloCol;
            this.rectorUnicoColegio()
          }
          /* caso rector con más de un colegio */
          else if (this.arregloCol.length > 1) {
            this.listaInstituciones = this.arregloCol.sort();
            this.rolGuardado = this.infoUsuario[0].perfil.nombre;
            this.etiquetaGuardada = this.infoUsuario[0].perfil.etiqueta;
            this.idPerfil = this.infoUsuario[0].perfil.id;
          }
        }
        /* Caso perfil administrador */
        else if (perfil === this.perfilAdmin) {
          this.ingresoAdmin()
        }
        /* Caso para rol de un solo colegio, una sede y una jornada */
        else if (this.cantPerfiles === 1) {
          this.unicoRegistro()
        }
        /* Caso para múltiples perfiles */
        else {
          this.tieneMasPerfiles = true;
          const conteoJornadas = this.infoUsuario.reduce((acumulador: any[], item: any) => {
            const nombreJornada = item.jornada.nombre;
            if (nombreJornada !== null) {
              acumulador[nombreJornada] = (acumulador[nombreJornada] || 0) + 1;
            }
            return acumulador;
          }, {});
          const nombresJornadas = Object.keys(conteoJornadas);
          this.titulos = nombresJornadas;
          this.tituloSeleccionado = this.titulos[0]
          this.mostrarPorJornada(this.tituloSeleccionado)
        }
      }
    }
    else {
      this.tieneMasPerfiles = true;
      const conteoJornadas = this.infoUsuario.reduce((acumulador: any[], item: any) => {
        const nombreJornada = item.jornada.nombre;
        if (nombreJornada !== null) {
          acumulador[nombreJornada] = (acumulador[nombreJornada] || 0) + 1;
        }
        return acumulador;
      }, {});
      const nombresJornadas = Object.keys(conteoJornadas);
      this.titulos = nombresJornadas;
      this.tituloSeleccionado = this.titulos[0]
      this.mostrarPorJornada(this.tituloSeleccionado)
    }
  }

  obtenerPerfiles() {
    this.arregloPerfiles = Object.values(this.perfilRector)
      .reduce((acumulador: string[], item: any) => {
        const nombre = item?.nombre;
        if (nombre && !acumulador.includes(nombre)) {
          acumulador.push(nombre);
        }
        return acumulador;
      }, []);
    this.cantRector = this.perfilRector.length;
    this.rolRector = this.arregloPerfiles[0];
  }

  obtenerColegiosRector() {
    this.colegiosRector = this.infoUsuario.map((item: any) => item.colegio);
    this.arregloCol = this.colegiosRector.reduce((acumulador: { id: number, nombre: string, localidad: any }[], colegio: any) => {
      if (colegio && colegio.id && colegio.nombre) {
        const yaExiste = acumulador.some(item => item.id === colegio.id);
        if (!yaExiste) {
          acumulador.push({ id: colegio.id, nombre: colegio.nombre, localidad: colegio.localidad });
        }
      }
      return acumulador;
    }, []);
  }

  obtenerSedesRector() {
    const sedesColegio = this.infoUsuario.filter((item: any) => item.colegio.id === this.idColegio);
    const sedesRector = sedesColegio.map((item: any) => item.sede);
    const sedesFiltradas = sedesRector.reduce((acumulador: { id: number, nombre: string }[], sede: any) => {
      if (sede && sede.id && sede.nombre) {
        const yaExiste = acumulador.some(item => item.id === sede.id);
        if (!yaExiste) {
          acumulador.push({ id: sede.id, nombre: sede.nombre });
        }
      }
      return acumulador;
    }, []);
    this.sedeFiltrada = sedesFiltradas.sort();
  }

  obtenerJornadasRector(sede: string) {
    const infoFiltradaPorSede = this.infoUsuario.filter((item: any) => item.sede.nombre === sede);
    const jornadasRector = infoFiltradaPorSede.map((item: any) => item.jornada);
    const jornadasFiltradas = jornadasRector.reduce((acumulador: { id: number, nombre: string }[], jornada: any) => {
      if (jornada && jornada.id && jornada.nombre) {
        const yaExiste = acumulador.some(item => item.id === jornada.id);
        if (!yaExiste) {
          acumulador.push({ id: jornada.id, nombre: jornada.nombre });
        }
      }
      return acumulador;
    }, []);
    this.jornadaFiltrada = jornadasFiltradas.sort();
  }

  rectorUnicoRegistro() {
    this.rolGuardado = this.rolRector;
    this.etiquetaGuardada = this.infoUsuario[0].perfil.etiqueta;
    this.idPerfil = this.infoUsuario[0].perfil.id;
    this.colegioGuardado = this.infoUsuario[0].colegio.nombre;
    this.idColegio = this.infoUsuario[0].colegio.id;
    this.SedeGuardada = this.infoUsuario[0].sede.nombre;
    this.idSede = this.infoUsuario[0].sede.id;
    this.jornadaGuardada = this.infoUsuario[0].jornada.nombre;
    this.idJornada = this.infoUsuario[0].jornada.id;
    this.foto_escudo = this.infoUsuario[0].colegio.foto_escudo.codificacion;
    this.idLocalidad = this.infoUsuario[0].colegio.localidad.id;
    this.localidadNombre = this.ingresando[0].colegio.localidad.nombre;
    this.guardar()
    this.router.navigate(['home']);
  }

  unicoRegistro() {
    this.rolGuardado = this.infoUsuario[0].perfil.nombre;
    this.etiquetaGuardada = this.infoUsuario[0].perfil.etiqueta;
    this.idPerfil = this.infoUsuario[0].perfil.id;
    this.colegioGuardado = this.infoUsuario[0].colegio.nombre;
    this.idColegio = this.infoUsuario[0].colegio.id;
    this.SedeGuardada = this.infoUsuario[0].sede.nombre;
    this.idSede = this.infoUsuario[0].sede.id;
    this.jornadaGuardada = this.infoUsuario[0].jornada.nombre;
    this.idJornada = this.infoUsuario[0].jornada.id;
    this.foto_escudo = this.infoUsuario[0].colegio.foto_escudo.codificacion;
    this.idLocalidad = this.infoUsuario[0].colegio.localidad.id;
    this.localidadNombre = this.infoUsuario[0].colegio.localidad.nombre;
    this.guardar();
    this.router.navigate(['home']);
    this.registros = true;
    this.usuarioService.gaurdarUnicoRegistro(this.registros)
  }

  rectorUnicoColegio() {
    this.ngSelectEnabled = true;
    this.colegioPorDefecto = this.arregloCol[0];
    this.filtrarPorColegio(this.colegioPorDefecto);
    this.rolGuardado = this.infoUsuario[0].perfil.nombre;
    this.etiquetaGuardada = this.infoUsuario[0].perfil.etiqueta;
    this.idPerfil = this.infoUsuario[0].perfil.id;
    this.idColegio = this.infoUsuario[0].colegio.id;
    this.colegioGuardado = this.colegioPorDefecto;
    this.placeHolderColegio = this.arregloCol[0].nombre;
    this.localidadNombre = this.infoUsuario[0].colegio.localidad.nombre;
    this.idLocalidad = this.infoUsuario[0].colegio.localidad.id;
  }

  ingresoAdmin() {
    this.router.navigate(['home']);
    this.rolGuardado = this.infoUsuario[0].perfil.nombre;
    this.etiquetaGuardada = this.infoUsuario[0].perfil.etiqueta;
    this.idPerfil = this.infoUsuario[0].perfil.id;
    this.guardar();
  }

  /* Métodos para Ng-Select */
  // Obtiene el colegio y ejecuta filtrarPorColegio //
  obtenerSedes(event: any) {
    this.nombreColegio = this.formulario.value.nombreColegio;
    if (!this.nombreColegio) {
      this.formulario.get('nombreSede')?.reset();
      this.formulario.get('nombreJornada')?.reset();
      if (this.selectSede) {
        this.selectSede.clearModel();
      }
      if (this.selectJornada) {
        this.selectJornada.clearModel();
      }
      this.sedeFiltrada = [];
      this.jornadaFiltrada = [];
      return;
    }
    this.filtrarPorColegio(this.nombreColegio);
    this.limpiarSeleccion(this.selectSede);
    this.limpiarSeleccion(this.selectJornada);
  }


  filtrarPorColegio(col: string) {
    const escudo = [...new Set(this.infoUsuario.reduce((acumulado: string[], item: any) => {
      if (item.colegio.id === col) {
        acumulado.push(item.colegio.foto_escudo.codificacion);
      }
      return acumulado;
    }, []))];
    this.foto_escudo = escudo[0]
    this.idColegio = parseInt(col);
    this.obtenerSedesRector();

    const colegio = this.listaInstituciones.find((colegio: any) => colegio.id === this.idColegio);
    if (colegio) {
      this.colegioGuardado = colegio.nombre;
      this.idLocalidad = colegio.localidad.id;
      this.localidadNombre = colegio.localidad.nombre;
    }
  }

  // Obtiene la sede y ejecuta filtrarPorSede //
  obtenerJornadas() {
    this.nombreSede = this.formulario.value.nombreSede;
    if (!this.nombreSede) {
      this.formulario.get('nombreJornada')?.reset();
      if (this.selectJornada) {
        this.selectJornada.clearModel();
      }
      this.jornadaFiltrada = [];
      return;
    }
    this.filtrarPorSede(this.nombreSede);
  }


  filtrarPorSede(sede: string) {
    this.idSede = parseInt(sede);
    const sedes = this.sedeFiltrada.find((sede: any) => sede.id === this.idSede);
    this.obtenerJornadasRector(sedes.nombre);
    if (sedes) {
      this.SedeGuardada = sedes.nombre;
    }
  }

  // Guarda jornada seleccionada //
  guardarJornada() {
    this.idJornada = this.formulario.value.nombreJornada;
    const jornada = this.jornadaFiltrada.find((jornada: any) => jornada.id === this.idJornada);
    if (jornada) {
      this.jornadaGuardada = jornada.nombre;
    }
  }

  //Valida ng-select //
  validarSelecciones() {
    if (this.formulario.controls["nombreColegio"].invalid) {
      this.mostrarError = true;
      return;
    }
    else if (this.formulario.controls["nombreSede"].invalid) {
      this.mostrarError = true;
      return;
    }
    else if (this.formulario.controls["nombreJornada"].invalid) {
      this.mostrarError = true;
      return;
    }

    if (this.ngSelectEnabled) {
      this.formulario.controls['nombreColegio'].setErrors(null);
    }
  };

  // Ingresa si formulario valido //
  ingresar() {
    if (this.formulario.valid) {
      this.ingresando = true;
      setTimeout(() => {
        this.router.navigate(['home'])
      }, 1000);
      this.guardar()
    }
    else if (this.formulario.value.nombreColegio = !'' && this.formulario.value.nombreSede != '' && this.formulario.value.nombreJornada != '') {
      this.ingresando = true;
      setTimeout(() => {
        this.router.navigate(['home'])
      }, 1000);
      this.guardar()
    }
  }

  // Guardar valores en sessionStorage //
  guardar() {
    this.usuarioService.borrarSeleccionColegio();
    this.usuarioService.guardarSeleccionColegio(this.colegioGuardado, this.SedeGuardada, this.jornadaGuardada, this.foto_escudo, this.rolGuardado, this.etiquetaGuardada, this.idColegio, this.idSede, this.idJornada, this.idPerfil, this.localidadNombre, this.idLocalidad);
  }


  /* Métodos para Matriz selección */
  mostrarPorJornada(jornada: string) {
    this.jornadaSeleccionada = jornada;
    this.registroFiltrado = this.infoUsuario.filter((item: any) => item.jornada.nombre === jornada)
    if (this.registroFiltrado.length === 0) {
      this.sinJornada = true;
    } else {
      this.sinJornada = false;
    }
  };

  filtrarPorTitulo() {
    const jornada = this.tituloSeleccionado;
    this.jornadaSeleccionada = jornada;
    this.registroFiltrado = this.infoUsuario.filter((item: any) => item.jornada.nombre === jornada)
    if (this.registroFiltrado.length === 0) {
      this.sinJornada = true;
    } else {
      this.sinJornada = false;
    }
  };

  seleccionarOpcion(opcion: string) {
    this.opcionSeleccionada = opcion;
  }

  verificar(titulo: string) {
    this.tituloSeleccionado = titulo;
  }

  validarCheck(): void {
    this.radioSeleccionado = false;
  }

  //Valida radio activo y guarda valores seleccionados
  validarSeleccionRadio(colegio: any) {
    this.radioSeleccionado = true;
    this.colegioSeleccionado = colegio;
    this.colegioGuardado = this.colegioSeleccionado.colegio.nombre;
    this.SedeGuardada = this.colegioSeleccionado.sede.nombre;
    this.jornadaGuardada = this.colegioSeleccionado.jornada.nombre;
    this.foto_escudo = this.colegioSeleccionado.colegio.foto_escudo.codificacion;
    this.rolGuardado = this.colegioSeleccionado.perfil.nombre;
    this.etiquetaGuardada = this.colegioSeleccionado.perfil.etiqueta;
    this.idPerfil = this.colegioSeleccionado.perfil.id;
    this.idColegio = this.colegioSeleccionado.colegio.id;
    this.idJornada = this.colegioSeleccionado.jornada.id;
    this.idSede = this.colegioSeleccionado.sede.id;
    this.idLocalidad = this.colegioSeleccionado.colegio.localidad.id;
    this.localidadNombre = this.colegioSeleccionado.colegio.localidad.nombre;
  }

  validarRegistro(registro: any) {
    this.registroSeleccionado = registro;
  }

  // Ingresa si formulario valido //
  entrar() {
    if (this.radioSeleccionado = true) {
      this.ingresando = true;
      setTimeout(() => {
        this.router.navigate(['home'])
      }, 1000);
      this.guardar()
    }
  }

  async logout() {
    this.usuarioService.borrarSeleccionColegio();
    this.usuarioService.cerrarSesion(this.esMicrosoft)
  };

  cerrarSesion() {
    if (this.esMicrosoft) {
      this.usuarioService.cerrarSesion(this.esMicrosoft)
    }
    else {
      const modalRef = this.servicioModal.open(ConfirmarCerrarSesionComponent, { size: 'md', centered: true, backdrop: 'static' })
    }
  };
}
