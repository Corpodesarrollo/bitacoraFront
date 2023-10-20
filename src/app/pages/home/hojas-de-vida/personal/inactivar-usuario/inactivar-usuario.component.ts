import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { PersonalService } from 'src/app/services/api/personal/personal.service';

@Component({
  selector: 'app-inactivar-usuario',
  templateUrl: './inactivar-usuario.component.html',
  styleUrls: ['./inactivar-usuario.component.scss']
})
export class InactivarUsuarioComponent {

  ngModal = inject(NgbActiveModal);
  registro:any
  idColegio!: number
  inactivando: boolean = false
  estaActivo!:boolean

  activeModal = inject(NgbActiveModal);
  modalService = inject(NgbModal)
  personalServices = inject(PersonalService)


  ngOnInit() {
    let datos_usuario = JSON.parse(sessionStorage.getItem('sap_sec_percol')!)
    this.idColegio = datos_usuario.colegio.idColegio;
    if(this.registro.estado === "ACTIVO"){
      this.estaActivo = true;
    }
    else{
      this.estaActivo = false;
    }
  }

  cerrar() {
    this.ngModal.close()
  }

  inactivarFuncionario() {
    this.inactivando = true;
    let estado_usuario;
    if(this.registro.estado === "ACTIVO"){
      estado_usuario = '0'
    }
    else{
      estado_usuario = '1'
    }
    let parametros = {
      institucion: this.idColegio,
      identificacion: this.registro.identificacion,
      estado: estado_usuario
    }

    this.personalServices.InactivarFuncionario(parametros).subscribe({
      next: (respuesta: any) => {
        if (respuesta.status === 200) {
          this.activeModal.close(true)
          this.inactivando = false;
        }
        else{
          const modalInformacion = this.modalService.open(ModalInformacionComponent, { size:'md', backdrop: 'static', animation: false, centered: true})
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: '¡Error al desasociar funcionario!',
            mensaje: respuesta.data
          }
          this.inactivando = false;
        }
      },
      error: (error) =>{
        const modalInformacion = this.modalService.open(ModalInformacionComponent, { size:'md', backdrop: 'static', animation: false, centered: true})
        modalInformacion.componentInstance.informacion = {
          error: true,
          esExitoso: 'error',
          titulo: '¡Error al desasociar funcionario!',
          mensaje: 'Debe seleccionar sede y/o jornada, antes de elegir un perfil'
        }
        this.inactivando = false;
      }
    })
  }

}
