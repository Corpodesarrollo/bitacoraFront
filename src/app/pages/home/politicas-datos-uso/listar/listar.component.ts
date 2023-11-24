import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';

@Component({
  selector: 'app-ver',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent {

  sinRegistros: boolean = false;
  cargandoListado: boolean = false;
  reenviando: boolean = false;
  reenviandoUso: boolean = false;


  listadoPersonas: any = []

  constructor(
    private serviciosPoliticas: PoliticasService,
    private servicioModal: NgbModal,
  ) {
    this.cargarListas()
  }

  cargarListas() {
    this.cargandoListado = true;
    this.listadoPersonas = []
    this.serviciosPoliticas.obtenerListaAceptacion().subscribe({
      next: (respuesta: any) => {
        if (respuesta.code === 200) {
          this.listadoPersonas = respuesta.data
          if (this.listadoPersonas.length <= 0) {
            this.sinRegistros = true;
          }
          this.cargandoListado = false;
        }
        else {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: 'Error',
            mensaje: 'No se pudo obtener listado de personas'
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  reenviarPoliticasDatos() {
    if (this.reenviando) {
      return;
    }
    this.reenviando = true;
    this.serviciosPoliticas.reenviarPoliticasDatos().subscribe({
      next: (respuesta: any) => {
        if (respuesta.status === 200) {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: false,
            esExitoso: 'done',
            titulo: 'Éxito',
            mensaje: 'Política de datos reenviada'
          }
          this.reenviando = false
          this.cargarListas();
        }
        else {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: 'Error',
            mensaje: 'No se pudo reenviar política de datos'
          }
          this.reenviando = false
        }
      },
      error: (error) => {
        console.log(error);
        this.reenviando = false
      }
    })
  }

  reenviarPoliticasUso() {
    if (this.reenviandoUso) {
      return;
    }
    this.reenviandoUso = true;
    this.serviciosPoliticas.reenviarPoliticasUso().subscribe({
      next: (respuesta: any) => {
        if (respuesta.status === 200) {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: false,
            esExitoso: 'done',
            titulo: 'Éxito',
            mensaje: 'Política de uso reenviada'
          }
          this.reenviandoUso = false;
          this.cargarListas();

        }
        else {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: 'Error',
            mensaje: 'No se pudo reenviar política de uso'
          }
          this.reenviandoUso = false;

        }
      },
      error: (error) => {
        console.log(error);
        this.reenviandoUso = false;

      }
    })
  }
}
