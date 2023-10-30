import { Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { UtilsService } from 'src/app/services/generales/utils/utils.service';

@Component({
  selector: 'app-mensaje-modal',
  templateUrl: './mensaje-modal.html',
  styleUrls: ['./mensaje-modal.scss']
})
export class MensajeModal implements OnDestroy {

  @Input() infoMensaje: any;


  constructor(private servicioModal: NgbModal,
    private mensajesService: MensajesService,
    private utilsService: UtilsService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private serviciosUsuario: UsuarioService) {
  }

  ngOnDestroy(): void {
    this.infoMensaje;
  }

  cerrarModal() {
    try {
      this.servicioModal.dismissAll();
      this.activeModal.close('cerrado');
    } catch (error) {
      // console.log(error)
    }
  }

  confirmarEliminarModal() {
    try {
      let datosUsuario:AccesoPerfil  = this.serviciosUsuario.obtenerAccesoSeleccionado();
      let usuarioLogueado = this.serviciosUsuario.obtenerUsuario();
      //console.log(this.infoMensaje)
      this.activeModal.close('cerrado');
      this.mensajesService.eliminarMensaje(this.infoMensaje.id, usuarioLogueado.id, datosUsuario.perfil.id).subscribe((resp: any) => {
        if (resp.body.code == 200) {
          let infoMensaje: any = {}
          infoMensaje.titulo = '';
          infoMensaje.mensaje = 'Mensaje eliminado';
          const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
          modalRef.componentInstance.infoMensaje = infoMensaje;
          // modalRef.result.then(() => {
          //   console.log('cerrado modal');
          // })
          setTimeout(()=>{
            this.servicioModal.dismissAll();
          },2000)
          // this.modalSubject.next({ ConfirmarEliminar: true }); // Emite un valor nulo al cerrar
          this.utilsService.sendConfirmacion(true)
          // this.cargarMensajes(this.parametrosFiltros);
        } else {
          let infoMensaje: any = {}
          const modalError = this.modalService.open(ModalInformacionComponent, { size: 'md', animation: false, backdrop: 'static', centered: true })
          modalError.componentInstance.informacion = {
            esExitoso: 'error',
            titulo: '¡Error!',
            mensaje: resp.body.message
          }
        }
      }, err => {
        let infoMensaje: any = {}
        infoMensaje.titulo = 'Error';
        infoMensaje.mensaje = 'No se pudo eliminar el mensaje';
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = infoMensaje;
        // modalRef.result.then(() => {
        //   console.log('cerrado modal');
        // })
        this.servicioModal.dismissAll();
        this.activeModal.close('cerrado');
        this.utilsService.sendConfirmacion(true)
      })

    } catch (error) {
      // console.log(error)
    }

  }

}
