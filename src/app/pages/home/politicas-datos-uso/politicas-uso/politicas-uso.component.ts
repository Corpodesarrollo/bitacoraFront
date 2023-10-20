import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgregarComponent } from './agregar/agregar.component';
import { Router } from '@angular/router';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';

@Component({
  selector: 'app-politicas-uso',
  templateUrl: './politicas-uso.component.html',
  styleUrls: ['./politicas-uso.component.scss']
})
export class PoliticasUsoComponent {

  sinRegistros: boolean = false;
  cargandoVersiones: boolean = false;
  registroVersiones: any
  idUsuario: number

  constructor(
    private servicioModal: NgbModal,
    private serviciosUsuarios: UsuarioService,
    private router: Router,
    private serviciosPoliticas: PoliticasService
  ) {
    this.idUsuario = parseInt(this.serviciosUsuarios.obtenerUsuario().id);
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
            mensaje: 'No se pudo obtener las politicas'
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  eliminarVersion(version: any) {
    this.cargandoVersiones = true;
    let parametros = {
      id_usuario: this.idUsuario,
      id_politica: version.id
    }
    this.serviciosPoliticas.eliminarPolitica(parametros).subscribe({
      next: (respuesta: any) => {
        if (respuesta.code === 200) {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: false,
            esExitoso: 'done',
            titulo: 'Exito',
            mensaje: 'Politica eliminada correctamente'
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

  agregarVersion() {
    const modalAgregar = this.servicioModal.open(AgregarComponent, { size: 'lg', backdrop: 'static', centered: true, animation: false })
    modalAgregar.result.then((result) => {
      if(result == true){
        this.obtenerPoliticas()
      }
    })
  }

  verPolitica(id: number) {
    this.router.navigate(['/home/politicas-datos-uso/politicas-uso', id])
  }

}
