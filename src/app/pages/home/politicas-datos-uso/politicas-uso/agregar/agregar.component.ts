import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';

interface TinyMCEConfig {
  selector: string;
  plugins: any;
  toolbar: any;
  image_title: boolean;
  automatic_uploads?: boolean;
  file_picker_types?: string;
  file_picker_callback?: (cb: any, value: any, meta: any) => void;
  content_style: string;
}
@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss']
})
export class AgregarComponent {

  creandoVersion:boolean = false;
  cargandoHtml:boolean = true;
  estado:boolean = true;
  formNuevaVersion!: FormGroup


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '17rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['backgroundColor'],
      ['insertImage', 'insertVideo'],
      ['insertLink', 'unlink']
    ],
    customClasses: []
  };

  constructor(
    private activeModal : NgbActiveModal,
    private servicioModal: NgbModal,
    private formBuilder: FormBuilder,
    private serviciosPoliticas: PoliticasService
  ){
    this.construirFormulario();
    setTimeout(() => {
      this.cargandoHtml = false;
    },2000)
  }

  construirFormulario() {
    this.formNuevaVersion = this.formBuilder.group({
      version_html: [],
      estado: [true]
    });
  }

  crearVersion(){
    let nueva_version = {
      contenido : this.formNuevaVersion.get("version_html").value,
    }
    this.serviciosPoliticas.crearPolitica(nueva_version).subscribe({
      next: (respuesta: any) => {
        if (respuesta.code === 200) {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: false,
            esExitoso: 'done',
            titulo: 'Éxito',
            mensaje: respuesta.message
          }
          this.activeModal.close(true)
        }
        else {
          const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          modalInformacion.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: 'Error',
            mensaje: respuesta.message
          }
        }
      },
      error: (error) => {
        const modalInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
        modalInformacion.componentInstance.informacion = {
          error: true,
          esExitoso: 'error',
          titulo: 'Error al crear nueva versión',
          mensaje: error.error
        }
      }
    })
  }

  abrirInactivar(event: Event){

  }

  cancelar(){
    this.activeModal.close()
  }
}
