import { HttpResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-desasociar-funcionario',
  templateUrl: './desasociar-funcionario.component.html',
  styleUrls: ['./desasociar-funcionario.component.scss']
})
export class DesasociarFuncionarioComponent {

  activeModal = inject(NgbActiveModal);
  modalService = inject(NgbModal)
  personalServices = inject(PersonalService)
  usuarioService = inject(UsuarioService);
  identificacion:any
  idColegio!:number
  desasociando:boolean = false

  cerrar() {
    this.activeModal.close()
  }

  ngOnInit(){
    let datosUsuario:AccesoPerfil  = this.usuarioService.obtenerAccesoSeleccionado();
    this.idColegio = datosUsuario.colegio.id;
  }

  desasociarFuncionario(){
    this.desasociando = true;
    let parametros = {
      institucion: this.idColegio,
      identificacion: this.identificacion
    }

    this.personalServices.desasociarFuncionario(parametros).subscribe({
      next:(respuesta:any) => {
        if(respuesta.status === 200){
          this.activeModal.close(true)
          this.desasociando = false;
        }
        else{
          const modalInformacion = this.modalService.open(ModalInformacionComponent, { size:'md', backdrop: 'static', animation: false, centered: true})
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: '¡Error al desasociar funcionario!',
            mensaje: respuesta.data
          }
          this.desasociando = false;
        }
      },
      error:(error) =>{
        const modalInformacion = this.modalService.open(ModalInformacionComponent, { size:'md', backdrop: 'static', animation: false, centered: true})
        modalInformacion.componentInstance.informacion = {
          error: true,
          esExitoso: 'error',
          titulo: '¡Error al desasociar funcionario!',
          mensaje: 'Debe seleccionar sede y/o jornada, antes de elegir un perfil'
        }
        this.desasociando = false;

      }
    })
  }
}
