import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Politica } from 'src/app/interfaces/politica.interface';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';
import { ModalInformacionComponent } from '../modal-informacion/modal-informacion.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ver-politicas',
  templateUrl: './ver-politicas.component.html',
  styleUrls: ['./ver-politicas.component.scss']
})
export class VerPoliticasComponent {

  cargandoVersion:boolean = false;
  versionId:number
  politica:Politica

  constructor(
    private servicioModal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private serviciosPoliticas: PoliticasService
  ){
    this.activatedRoute.params.subscribe((params:any) => {
      if(params.id){
        this.versionId = params.id;
        this.cargarVersion(params.id);
      }
    });
  }

  cargarVersion(version:number){
    this.cargandoVersion = true;
    this.serviciosPoliticas.obtenerPolitica(version).subscribe({
      next: (respuesta: any) => {
        if (respuesta.code === 200) {
          this.politica = respuesta.data
          this.cargandoVersion = false
        }
        else {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: 'Error al visualizar politica',
            mensaje: respuesta.message
          }
          this.cargandoVersion = false
        }
      },
      error: (error) => {
        const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
        modalInformacion.componentInstance.informacion = {
          error: true,
          esExitoso: 'error',
          titulo: 'Error al visualizar politica',
          mensaje: error.error
        }
        this.cargandoVersion = false
      }
    })
  }
}
