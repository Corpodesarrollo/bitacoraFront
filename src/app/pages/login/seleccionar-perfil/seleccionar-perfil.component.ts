import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmarCerrarSesionComponent } from 'src/app/components/confirmar-cerrar-sesion/confirmar-cerrar-sesion.component';
import { environment } from 'src/environments/environment';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { InfoUsuario } from 'src/app/interfaces/infoUsuario.interface';
import { Perfil } from 'src/app/interfaces/perfil.interface';
import { niveles } from 'src/app/enums/niveles.enum';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { forkJoin } from 'rxjs';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';
import { PoliticaDatosComponent } from '../politica-datos/politica-datos.component';

@Component({
  selector: 'app-seleccionar-perfil',
  templateUrl: './seleccionar-perfil.component.html',
  styleUrls: ['./seleccionar-perfil.component.scss']
})

export class SeleccionarPerfilComponent implements OnInit {
  vistaSeleccion:string = 'no_institucion';
  usuarioId:number;

  estaRecargando:boolean = false;
  cargandoPerfil:boolean = false;
  cargandoPermisos:boolean = false;
  esMicrosoft: boolean = false;
  idPoliticaActiva: string;

  infoUsuario: InfoUsuario;
  perfilesUsuario: Perfil[]=[];

  constructor(
    private router: Router,
    private serviciosUsuario: UsuarioService,
    private authService: MsalService,
    private servicioModal: NgbModal,
    private politicasService: PoliticasService,
  ) {
    this.usuarioId = this.serviciosUsuario.obtenerUsuario().id;
  };

  ngOnInit(): void {
    this.esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
    this.consultarPoliticas(this.usuarioId)
  };

  async cargarInfoUsuario(){
    let infoUsuarioGuardada:InfoUsuario = await this.serviciosUsuario.obtenerInfoGuardada();
    this.cargandoPerfil = true;
    if (infoUsuarioGuardada){
      this.configurarVista(infoUsuarioGuardada);
      this.cargandoPerfil = false;
    }else{
      this.serviciosUsuario.obtenerInfoUsuario(this.usuarioId).subscribe({
        next: (infoUsuario: InfoUsuario) => {
          //console.log("Info Usuarios: ", infoUsuario.registros);
          if(infoUsuario.registros){
            this.serviciosUsuario.guardarInfoCargada(infoUsuario.registros);
            this.configurarVista(infoUsuario.registros);
          }else{
            this.vistaSeleccion='sin_accesos';
          }
          this.cargandoPerfil = false;
        },
        error: (error: any) => {
          console.error(error);
        }
      });
    }
  }

  configurarVista(infoUsuario:any){
    this.identificarPerfiles(infoUsuario);
    //console.log("Perfiles d: ", this.perfilesUsuario);
    if(this.perfilesUsuario.length>0){
      if(infoUsuario.length>1){
        let tieneNivelInstitucion = this.perfilesUsuario.find((perfilUsuario:Perfil)=> perfilUsuario.idPerfilNivel==niveles.institucion);
        if(tieneNivelInstitucion){
          this.vistaSeleccion='institucion';
        }else{
          let perfilesNoInstitucionales = [niveles.distrito, niveles.nivel_central_poa,  niveles.localidad];
          let tieneNivelNoInstitucional = this.perfilesUsuario.find((perfilUsuario:Perfil)=> perfilesNoInstitucionales.includes(perfilUsuario.idPerfilNivel));

          if(tieneNivelNoInstitucional){
            this.vistaSeleccion='no_institucion';
          }else{
            this.vistaSeleccion='institucion_sede_jornada';
          }
        }
      }else{
        this.serviciosUsuario.guardarUnicoRegistro(true);
        this.seleccionarAcceso(infoUsuario[0]);
      }
    }
    this.infoUsuario = infoUsuario;
  }

  async seleccionarAcceso(accesoSeleccionado:AccesoPerfil){
    //console.log("Accesos Seleccionado: ", accesoSeleccionado);
    this.serviciosUsuario.guardarAcceso(accesoSeleccionado);
    this.cargandoPermisos = true;
    await this.serviciosUsuario.guardarPermisosPerfil(accesoSeleccionado.perfil.id);
    this.abrirSesionAE(accesoSeleccionado.perfil.idPerfilNivel);
    this.cargandoPermisos = false;
    this.router.navigate(['home']);
  }

  async abrirSesionAE(nivelPerfilId:number){
    const accesoSel  = this.serviciosUsuario.obtenerAccesoSeleccionado();

    let url = environment.URL_LOGIN_NARANJA;
    let credenciales = await this.serviciosUsuario.obtenerCredenciales();
    url = url.replace("{{usuario}}", credenciales.usuario).replace("{{contrasenia}}", credenciales.contrasenia);

    // SE IDENTIFICA EL NIVEL DEL PERFIL PARA AGREGAR VARIABLES NECESARIAS
    // TIPOS PERFIL ADMINSEC
    if(niveles.distrito==nivelPerfilId || niveles.nivel_central_poa==nivelPerfilId || niveles.localidad==nivelPerfilId){
      url = url.replace("{{key}}", "0")
    }
    // TIPOS PERFIL RECTOR
    if(niveles.institucion==nivelPerfilId){
      url = url.replace("{{key}}", "2")
      url += `&inst=${accesoSel.colegio.id}&sede=${accesoSel.sede.id}&jornada=${accesoSel.jornada.id}&inst_=${encodeURIComponent(accesoSel.colegio.nombre)}&sede_=${encodeURIComponent(accesoSel.sede.nombre)}&jornada_=${encodeURIComponent(accesoSel.jornada.nombre)}`
    }
    // TIPOS VARIOS PERFILES
    if(niveles.institucion_sede_jornada==nivelPerfilId){
      url = url.replace("{{key}}", "1")
      url += `&perfilPedido=${accesoSel.perfil.codJerarquia}|${accesoSel.perfil.id}`;
    }
    var nuevaVentana =window.open(url,'_blank','toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=20000, top=20000, width=2, height=2, visible=none');
    nuevaVentana.resizeTo(0, 0);
    nuevaVentana.moveTo(10000, 10000);
    setTimeout(() => {
      nuevaVentana.close();
    }, 2000);
  }

  identificarPerfiles(accesos:AccesoPerfil[]){
    for(let a=0; a<accesos.length; a++){
      this.agregarPerfil(accesos[a].perfil);
    }
  }

  agregarPerfil(perfil:Perfil){
    if(this.perfilesUsuario.length>0){
      let perfilEncontrado = this.perfilesUsuario.find((perfilUsuario:Perfil)=> perfilUsuario.nombre==perfil.nombre);
      if(!perfilEncontrado){
        this.perfilesUsuario.push(perfil);
      }
    }else{
      this.perfilesUsuario.push(perfil);
    }
  }

  cerrarSesion(event?:any) {
    this.serviciosUsuario.borrarSeleccionColegio();
    if (this.esMicrosoft) {
      this.serviciosUsuario.cerrarSesion(this.esMicrosoft)
    }
    else {
      const modalRef = this.servicioModal.open(ConfirmarCerrarSesionComponent, { size: 'md', centered: true, backdrop: 'static' })
    }
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


  /**
   * Metodos que consulta si el usuario ha aceptado las politicas,
   * o si viene reenviada
   */
  consultarPoliticas(id_usuario: any) {
    this.cargandoPerfil  = true
    let observables = []
    observables.push(this.politicasService.consultarTienePoliticaDatos(id_usuario))
    observables.push(this.politicasService.consultarTienePoliticaUso(id_usuario))
    if (observables.length > 0) {
      forkJoin(observables).subscribe({
        next: (respuestas: any[]) => {
          let errorEncontrado = false;
          for (const respuesta of respuestas) {
            if (respuesta.code != 200) {
              errorEncontrado = true;
              const modalError = this.servicioModal.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
              modalError.componentInstance.informacion = {
                error: true,
                esExitoso: 'error',
                titulo: 'Ocurrio un error, por favor intente mas',
                mensaje: 'No se pudo acceder al sistema'
              };
              this.serviciosUsuario.cerrarSesion(this.esMicrosoft)
            }
          }
          if (!errorEncontrado) {
            const mostrar_politicas = respuestas.some((politica) => politica.data[0].aceptada == false || politica.data[0].reenviar === true)
            if (mostrar_politicas) {
              const modalPoliticas = this.servicioModal.open(PoliticaDatosComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
              modalPoliticas.componentInstance.respuestaPoliticas = respuestas;
              modalPoliticas.componentInstance.idUsuario = id_usuario;
              modalPoliticas.result.then((result) => {
                if(result == true ){
                  this.cargarInfoUsuario();
                }
                else{
                  this.serviciosUsuario.cerrarSesion(this.esMicrosoft)
                }
              })
            }
            else{
              this.cargarInfoUsuario();
            }
          }
        },
        error: (error) => {
          const modalError = this.servicioModal.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
          modalError.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: 'Ocurrio un error, por favor intente mas tarde',
            mensaje: 'No se pudo acceder al sistema'
          };
          this.serviciosUsuario.cerrarSesion(this.esMicrosoft)
        },
      });
    }
  }

}
