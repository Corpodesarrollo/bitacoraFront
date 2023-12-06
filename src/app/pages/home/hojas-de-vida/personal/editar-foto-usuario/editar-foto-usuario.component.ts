import { Component, ViewChild, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatosFuncionarios } from 'src/app/interfaces/datos_funcionarios.interface';
import { PersonalService } from 'src/app/services/api/personal/personal.service';

@Component({
  selector: 'app-editar-foto-usuario',
  templateUrl: './editar-foto-usuario.component.html',
  styleUrls: ['./editar-foto-usuario.component.scss']
})
export class EditarFotoUsuarioComponent {

  /**
   * visualiza lso componentes de los modales
   * acorde a si es exitoso o no la carga de la foto
   */
  @ViewChild("modalExito") modalExito:any
  @ViewChild("modalError") modalError:any

  guardandoFotografia:boolean = false;
  traeMensaje:boolean = true
  esFotografia:boolean | any

  identificacionUsuario!:number;
  fotoUsuario:any
  registroUsuario:any
  urlFotoUsuario!:string
  mensajeModal:string = 'No se pudo actualizar la fotografía correctamente.'

  constructor(
    private modalActivo: NgbActiveModal,
    private servicioModal: NgbModal,
    private personalServices: PersonalService,
    private modalService: NgbModal
  ){

  }

  /**
   * Metood que recibe la identificacion del usaurio
   * y la url del la foto
   * del registro recibido de datos-funcionarios
   */
  ngOnInit(){
    this.identificacionUsuario = this.registroUsuario.identificacion
    this.urlFotoUsuario = this.registroUsuario.foto
  }

  /**
   * Metodo que actualiza la vista
   * de la foto que carga el usuario
   */
  actualizarFoto(event:any){
    this.fotoUsuario = event
  }

  /**
   * @param event
   * Recibe el evento
   * para ver si la foto es tomada por camara
   * o si es cargada
   */
  esTomada(event:any){
    this.esFotografia = event
  }

  /**
   * Metodo que se encarga
   * de guardar la foto
   */
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

  /**
   * Metodo que cierra el modal
   */
  cerrarModal(){
    this.modalService.dismissAll()
  }

}
