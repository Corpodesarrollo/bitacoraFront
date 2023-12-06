import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgregarComponent } from './agregar/agregar.component';
import { Router } from '@angular/router';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';

@Component({
  selector: 'app-politicas-uso',
  templateUrl: './politicas-uso.component.html',
  styleUrls: ['./politicas-uso.component.scss']
})
export class PoliticasUsoComponent {

  sinRegistros: boolean = false;
  cargandoVersiones: boolean = false;
  registroVersiones: any;
  idUsuario: number;
  puedeEliminar:boolean;
  puedeCrearPolitica:boolean;

  constructor(
    private servicioModal: NgbModal,
    private serviciosUsuarios: UsuarioService,
    private router: Router,
    private serviciosPoliticas: PoliticasService
  ) {
    this.idUsuario = parseInt(this.serviciosUsuarios.obtenerUsuario().id);
    this.puedeEliminar = this.serviciosUsuarios.obtetenerPermisosPerfil(PermisosUsuarios.ELIMINAR_POLITICA_USO)
    this.puedeCrearPolitica = this.serviciosUsuarios.obtetenerPermisosPerfil(PermisosUsuarios.CREAR_POLITICA_USO)
    this.obtenerPoliticas()
  }


  obtenerPoliticas() {
    this.cargandoVersiones = true;
    this.registroVersiones = []
    this.serviciosPoliticas.obtenerListaVersiones().subscribe({
      next: (respuesta: any) => {
        if (respuesta.code === 200) {
          this.registroVersiones = respuesta.data
          if(this.registroVersiones.length <= 0){
            this.sinRegistros = true;
          }
          this.cargandoVersiones = false;
        }
        else {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: 'Error',
            mensaje: 'No se pudo obtener las políticas'
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  eliminarVersion(version: any) {

    if(version.estado == true){
      const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
      modalInformacion.componentInstance.informacion = {
        error: false,
        esExitoso: 'warning',
        titulo: 'Advertencia',
        mensaje: 'No se puede eliminar la Política activa'
      }
    }
    else{
      this.cargandoVersiones = true;
      let parametros = {
        id_usuario: this.idUsuario,
        id_politica: version.id
      }
      this.serviciosPoliticas.eliminarPolitica(parametros).subscribe({
        next: (respuesta: any) => {
          if (respuesta.status === 200) {
            const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
            modalInformacion.componentInstance.informacion = {
              error: false,
              esExitoso: 'done',
              titulo: 'Exito',
              mensaje: 'Política eliminada correctamente'
            }
            this.obtenerPoliticas();
            this.cargandoVersiones = false
          }
          else {
            const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
            modalInformacion.componentInstance.informacion = {
              error: true,
              esExitoso: 'error',
              titulo: 'Error al eliminar',
              mensaje: respuesta.message
            }
            this.cargandoVersiones = false
          }
        },
        error: (error) => {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: 'Error al eliminar',
            mensaje: error.error
          }
          this.cargandoVersiones = false
        }
      })
    }
  }

  agregarVersion() {
    const modalAgregar = this.servicioModal.open(AgregarComponent, { size: 'lg', backdrop: 'static', centered: true, animation: false })
    modalAgregar.result.then((result) => {
      if(result == true){
        this.obtenerPoliticas()
      }
    })
  }

  verPolitica(id: number) {
    this.router.navigate(['/home/politicas-datos-uso/ver-politicas-uso', id])
  }

  volver(){
    history.back()
  }

}
