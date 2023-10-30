import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Politica } from 'src/app/interfaces/politica.interface';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';
import { ModalInformacionComponent } from '../../../../components/modal-informacion/modal-informacion.component';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-ver-politicas',
  templateUrl: './ver-politicas.component.html',
  styleUrls: ['./ver-politicas.component.scss']
})
export class VerPoliticasComponent {

  idPolitica:number;

  cargandoVersion:boolean = false;
  versionId:number
  politica:Politica
  contenido:any;

  constructor(
    private servicioModal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private serviciosPoliticas: PoliticasService,
    private sanitizer: DomSanitizer
  ){

  }

  ngOnInit(){
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
          this.contenido = this.sanitizeHtml(respuesta.data.contenido)
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

  /**
   * Metod par alimpiar el HTML
   */
  sanitizeHtml(html: string): SafeHtml {
    let nuevo_html = this.verificarHTML(html)
    return this.sanitizer.bypassSecurityTrustHtml(nuevo_html);
  }

  /**
   *Metodo para ajustar el HTML
   */
  verificarHTML(html: string): string {
    return html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }

  volver(){
    history.back()
  }

}
