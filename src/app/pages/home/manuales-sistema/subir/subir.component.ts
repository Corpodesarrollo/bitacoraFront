import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManualesService } from 'src/app/services/api/manuales/manuales.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild, ElementRef } from '@angular/core';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';


@Component({
  selector: 'app-subir',
  templateUrl: './subir.component.html',
  styleUrls: ['./subir.component.scss']
})

export class SubirComponent {
  @ViewChild('archivoPesado', { static: true }) archivoPesadoTemplate: any;
  @ViewChild('archivoCargado', { static: true }) archivoCargadoTemplate: any;
  @ViewChild('archivoNoPdf', { static: true }) archivoNoPdfTemplate: any;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;


  formularioCategoria!: FormGroup;
  archivoGuardado: boolean = false;
  archivoPesado: boolean = false;
  errorCategoria: boolean = false;
  tiposManuales: any;


  idCategoria: number = 0;
  categoriaSeleccionada: boolean = false;
  formData: FormData = new FormData();
  formDatas: FormData[] = [];
  esPdf: boolean = false;
  cargandoArchivo: boolean = false;
  private modalArchivoPesado: any;
  private modalArchivoCargado: any;
  private modalArchivoNoPdf: any;

  constructor(private servicioModal: NgbModal,
    private manualesService: ManualesService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.construirFormulario();
    this.obtenerTiposManuales();
  }

  verManuales() {
    this.router.navigateByUrl("/home/manuales-sistema")
  };

  /**
   * Metodo par abtener los tipos de manuales
   */
  obtenerTiposManuales() {
    this.manualesService.obtenerCategorias().subscribe(
      (data: any) => {
        if (data) {
          console.log(data.data);
          this.tiposManuales = data.data;
        }
      })
  }

  construirFormulario() {
    this.formularioCategoria = this.formBuilder.group({
      categoria_manual: [null, Validators.required]
    });
  }

  campoNoValidoFormulario(campo: string) {
    return this.formularioCategoria.get(campo)?.invalid && this.formularioCategoria.get(campo)?.touched;
  }

  cargarArchivo() {
    if (this.formularioCategoria.invalid) {
      Object.values(this.formularioCategoria.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      const modalInformacion = this.servicioModal.open(ModalInformacionComponent,{size: 'md', centered: true, animation: true,backdrop: 'static'})
      modalInformacion.componentInstance.informacion = {
        esExitoso: 'warning',
        titulo: '¡Advertencia!',
        mensaje: 'Debe seleccionar primero una categoría.'
      }
    }
  }

  archivoSeleccionado(event) {
    const element = event.target as HTMLInputElement;
    const archivo = element.files?.item(0);
    if (archivo) {
      const tamanoDocumento = archivo.size / 1024 / 1024;
      if (tamanoDocumento > 10) {
        this.archivoPesado = true;
        this.fileInput.nativeElement.value = "";
        this.abrirArchivoPesado();
      } else {
        if (archivo.type === 'application/pdf') {
          this.procesarPDF(archivo);
        } else {
          this.abrirArchivoNoPdf();
          this.fileInput.nativeElement.value = "";
        }
      }
    }
  }

  procesarPDF(documento: File) {
    this.formData.append('manualFile', documento, documento.name);
    this.crearObjetoPdf();
  }

  crearObjetoPdf() {
        this.cargandoArchivo = true;
        let categoria_manual = this.formularioCategoria.get('categoria_manual')?.value
        this.manualesService.guardarManual(categoria_manual, this.formData).subscribe(
          {
            next: (respuesta: any) => {
              if (respuesta.code === 200) {
                this.archivoGuardado = true;
                this.abrirArchivoCargado()
                this.cargandoArchivo = false;

              }
              else if (respuesta.code === 204) {
                this.archivoGuardado = false;
                const modalInformacion = this.servicioModal.open(ModalInformacionComponent, {
                  size: 'md', animation: false, centered: true, backdrop: 'static'
                })
                modalInformacion.componentInstance.informacion = {
                  esExitoso: 'warning',
                  titulo: 'Información',
                  mensaje: 'No se puede cargar, el archivo ya existe'
                }
                this.cargandoArchivo = false;
                this.recargar()
              }
              else {
                this.archivoGuardado = false;
                this.cargandoArchivo = false;
                this.fileInput.nativeElement.value = "";
                const modalInformacion = this.servicioModal.open(ModalInformacionComponent, {
                  size: 'md', animation: false, centered: true, backdrop: 'static'
                })
                modalInformacion.componentInstance.informacion = {
                  esExitoso: 'error',
                  titulo: 'Error',
                  mensaje: 'No se pudo cargar archivo'
                }
                this.recargar()
              }
            },
            error: (error) => {
              this.cargandoArchivo = false
              const manualInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
              this.fileInput.nativeElement.value = "";
              manualInformacion.componentInstance.informacion =
              {
                error: true,
                esExitoso: 'Error',
                titulo: 'Error al cargar manual',
                mensaje: `${error.error.error}`
              }
              this.recargar()
            }
          }
        )

  }

  resetearComponente() {
    this.fileInput.nativeElement.value = "";
    setTimeout(() => {
      this.archivoGuardado = false;
      this.archivoPesado = false;
      this.errorCategoria = false;
      setTimeout(() => {
        this.verManuales();
        this.cerrarCargado()
        this.recargar();

      }, 2500);
    }, 1000);
  }

  abrirArchivoPesado() {
    this.modalArchivoPesado = this.servicioModal.open(this.archivoPesadoTemplate, { size: 'md', centered: true, backdrop: 'static' });
    this.recargar();
  }

  abrirArchivoNoPdf() {
    this.modalArchivoNoPdf = this.servicioModal.open(this.archivoNoPdfTemplate, { size: 'md', centered: true, backdrop: 'static' });
    this.recargar();
  }

  abrirArchivoCargado() {
    this.modalArchivoCargado = this.servicioModal.open(this.archivoCargadoTemplate, { size: 'md', centered: true, backdrop: 'static' });
    this.resetearComponente();
    setTimeout(() => {
      this.verManuales();
      this.cerrarCargado()
    }, 2500);
  }

  recargar() {
    this.fileInput.nativeElement.value = "";
    this.archivoGuardado = false;
    this.archivoPesado = false;
    this.errorCategoria = false;
    this.formData = new FormData();
    this.formDatas = [];
    this.formularioCategoria.reset()
  }

  cerrar() {
    if (this.modalArchivoPesado) {
      this.modalArchivoPesado.close();
    }
  }

  cerrarCargado() {
    if (this.modalArchivoCargado) {
      this.modalArchivoCargado.close();
    }
  }

  cerrarNoPdf() {
    if (this.modalArchivoNoPdf) {
      this.modalArchivoNoPdf.close();
    }
  }
}
