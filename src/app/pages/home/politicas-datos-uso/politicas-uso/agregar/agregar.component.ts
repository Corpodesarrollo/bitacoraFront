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
  estado:boolean = true;
  formNuevaVersion!: FormGroup


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '17rem',
    minHeight: '5rem',
    placeholder: 'Ingresar texto...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['backgroundColor'],
      ['insertImage', 'insertVideo'],
      ['link', 'unlink' , 'undo', 'redo' ,
      'textColor' , 'removeFormat', 'fontSize',
      'heading', 'fontName' , 'customClasses' ,'insertHorizontalRule', 'toggleEditorMode']
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
  }

  construirFormulario() {
    this.formNuevaVersion = this.formBuilder.group({
      version_html: [],
      estado: [true]
    });
  }

  ngAfterViewInit() {
      this.cambiarTooltip("bold-", "Negrilla");
      this.cambiarTooltip("insertImage-", "Insertar imagen");
      this.cambiarTooltip("italic-", "Cursiva");
      this.cambiarTooltip("underline-", "Subrayar");
      this.cambiarTooltip("strikeThrough-", "Tachar");
      this.cambiarTooltip("subscript-", "Sub índice");
      this.cambiarTooltip("superscript-", "Exponente");
      this.cambiarTooltip("justifyLeft-", "Justificar a la izquierda");
      this.cambiarTooltip("justifyCenter-", "Justificar al centro");
      this.cambiarTooltip("justifyRight-", "Justificar a la derecha");
      this.cambiarTooltip("justifyFull-", "Justificar");
      this.cambiarTooltip("indent-", "Identar");
      this.cambiarTooltip("outdent-", "Sangria");
      this.cambiarTooltip("insertUnorderedList-", "Listar");
      this.cambiarTooltip("insertOrderedList-", "Enumerar");
      this.cambiarTooltip("foregroundColorPicker-", "Color");
      this.cambiarTooltip("insertHorizontalRule-", "Linea horizontal");
      this.cambiarTooltip("clearFormatting-", "Limpiar formato");
      this.cambiarTooltip("backgroundColorPicker-", "Resaltar");
      this.ocultarBotones("toggleEditorMode-");
  }

  ocultarBotones(idButton){
    const boton = document.getElementById(idButton);
    if (boton) {
      boton.style.display = 'none';
    }
  }

  cambiarTooltip(botonId: string, tooltip: string) {
      try {
        const elemento = document.getElementById(botonId);
        if (elemento) {
          elemento.title = tooltip;
        }
      } catch (error) {
        console.log('Error al traducir ' + botonId);
      }
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
            mensaje: 'La política de uso fue creada Exitosamente!'
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
