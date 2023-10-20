import { Component, ViewChild, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatosFuncionarios } from 'src/app/classes/datos_funcionarios.interface';
import { PersonalService } from 'src/app/services/api/personal/personal.service';

@Component({
  selector: 'app-editar-foto-usuario',
  templateUrl: './editar-foto-usuario.component.html',
  styleUrls: ['./editar-foto-usuario.component.scss']
})
export class EditarFotoUsuarioComponent {

  @ViewChild("modalExito") modalExito:any
  @ViewChild("modalError") modalError:any
  guardandoFotografia:boolean = false;
  identificacionUsuario!:number;
  traeMensaje:boolean = true
  fotoUsuario:any
  registroUsuario:any
  esFotografia:boolean | any
  urlFotoUsuario!:string
  mensajeModal:string = 'No se pudo actulizar la fotografía correctamente.'

  constructor(
    private modalActivo: NgbActiveModal,
    private servicioModal: NgbModal,
    private personalServices: PersonalService,
    private modalService: NgbModal
  ){

  }

  ngOnInit(){
    this.identificacionUsuario = this.registroUsuario.identificacion
    this.urlFotoUsuario = this.registroUsuario.foto
  }

  /**
   * Carga la foto del funcionario
   */

  actualizarFoto(event:any){
    this.fotoUsuario = event
  }

  esTomada(event:any){
    this.esFotografia = event
  }

  guardarFoto(){
    this.guardandoFotografia = true
    if(this.fotoUsuario){
      let parametros = {
        es_fotografia: this.esFotografia ? '1' : '0',
        indentificacion: this.identificacionUsuario
      }
      let foto_usuario = this.fotoUsuario
      const formDataImagen = new FormData();
      formDataImagen.append('photo', foto_usuario)
      this.personalServices.actualizarFoto(parametros, formDataImagen).subscribe({
        next:(respuesta) => {
          if(respuesta.status === 200){
            this.modalActivo.close()
            this.servicioModal.open(this.modalExito,{ size: 'md', centered: true,  animation: false, backdrop: 'static', windowClass: 'modal_login'});
            this.guardandoFotografia = false
          }
          else{
            this.servicioModal.open(this.modalError,{ size: 'md', centered: true,  animation: false, backdrop: 'static', windowClass: 'modal_login'});
            this.guardandoFotografia = false
          }
        }
      })
    }
    else{
      this.mensajeModal = 'Seleccione un archivo o capture una imagen para ser almacenada'
      this.servicioModal.open(this.modalError,{ size: 'md', centered: true,  animation: false, backdrop: 'static', windowClass: 'modal_login'});
      this.guardandoFotografia = false
    }
  }

  cerrarModal(){
    this.modalService.dismissAll()
  }

}
