import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ManualesService } from 'src/app/services/api/manuales/manuales.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.scss']
})
export class VerComponent {
  @ViewChild('confirmarBorradoModal', { static: true }) confirmarBorradoTemplate: any;

  esAdmin: boolean = false;
  respuesta: any;
  registros: any;
  manual: any;
  nivelUsuario: any;
  tiposManuales: any;
  idManual: any;
  manualEliminado: boolean = false;
  categoriasConManuales: any;
  hayManuales: boolean = false;
  sinManuales: boolean = false;
  cargaExitosa: boolean = false;

  private urlManual: string = '';
  private nombreManual: string = '';
  private modalBorrado: any;

  constructor(private servicioModal: NgbModal,
    private sanitizer: DomSanitizer,
    private router: Router,
    private manualService: ManualesService,
    private UsuarioService: UsuarioService) {
    this.nivelUsuario = this.UsuarioService.obtenerAccesoSeleccionado().perfil.idPerfilNivel
    this.obtenerCategoriasConManuales()
  };

  ngOnInit() {
    this.obtenerTiposManuales();
    if ( this.nivelUsuario == 1) {
      this.esAdmin = true
    } else {
      this.esAdmin = false
    }
  };

  subirManual() {
    this.router.navigateByUrl("/home/manuales-sistema/subir-manual")
  };

  obtenerCategoriasConManuales() {
    this.manualService.obtenerCategorias().subscribe(respuestaCategorias => {
      const categorias = respuestaCategorias.data;
      const observables = categorias.map((categoria: any) =>
        this.manualService.obtenerManualesPorCategoria(categoria.codigo).pipe(
          map(respuestaManuales => {
            const manuales = respuestaManuales.data;
            return { ...categoria, manuales };
          })
        )
      );
      forkJoin(observables).subscribe(resultados => {
        this.categoriasConManuales = resultados;
        this.cargaExitosa = true;
      });
    });

  }

  obtenerTiposManuales() {
    this.manualService.obtenerCategorias().subscribe(
      (data: any) => {
        if (data) {
          this.tiposManuales = data.data;
        }
      })
  }

  async descargarManual(element: number) {
    this.idManual = element;
    try {
      const data: any = await this.manualService.obtenerManual(this.idManual).toPromise();
      if (data && data.data && data.data.encoded) {
        let codificacionManual = data.data.encoded;
        this.urlManual = "data:application/pdf;base64," + codificacionManual;
        this.nombreManual = data.data.nombreArchivo;
        this.iniciarDescarga();
      }
    } catch (error) {
      console.error('Error al obtener el manual:', error);
    }
  }

  iniciarDescarga() {
    const safeUrl = this.descargarPdf(this.urlManual);
    const link = document.createElement('a');
    link.href = (safeUrl as any).changingThisBreaksApplicationSecurity;
    link.download = this.nombreManual;
    link.click();
  }

  descargarPdf(base64Data: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Data);
  };

  verManual(element: number) {
    this.idManual = element;
    this.manualService.obtenerManual(this.idManual).subscribe(
      (data: any) => {
        if (data) {
          const base64Codificacion = data.data.encoded;
          const blob = this.base64ToBlob(base64Codificacion, 'application/pdf');
          const blobURL = URL.createObjectURL(blob);
          const win = window.open(blobURL, '_blank');
        }
      })
  }

  base64ToBlob(base64: string, type: string): Blob {
    const binString = atob(base64);
    const len = binString.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binString.charCodeAt(i);
    }
    return new Blob([arr], { type: type });
  }


  abrirConfirmarBorrado() {
    this.modalBorrado = this.servicioModal.open(this.confirmarBorradoTemplate, { size: 'md', centered: true, backdrop: 'static' });
  }

  cerrar() {
    if (this.modalBorrado) {
      this.modalBorrado.close();
    }
  }

  obtenerId(elemento: HTMLElement) {
    this.idManual = elemento;
  }

  eliminarManual(idManual: number) {
    this.manualService.eliminarManual(idManual).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.manualEliminado = true;
        } else {
          const manualInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
          manualInformacion.componentInstance.informacion =
          {
            error: true,
            esExitoso: 'Error',
            titulo: 'Error al eliminar mensaje',
            mensaje: 'Ocurrio un error al eliminar'
          }
          this.manualEliminado = false;
        }
        this.resetearComponente();
      },
      error => {
        const manualInformacion = this.servicioModal.open(ModalInformacionComponent, { size: 'md', centered: true, animation: false, backdrop: 'static' })
        manualInformacion.componentInstance.informacion =
        {
          error: true,
          esExitoso: 'Error',
          titulo: 'Error al eliminar mensaje',
          mensaje: 'Ocurrio un error al eliminar'
        }
        this.manualEliminado = false;
        this.resetearComponente();
      }
    );
  }

  transformarNombre(nombre: string): string {
    const sinExtension = nombre.split('.')[0];
    const palabras = sinExtension.split(/(?=[A-Z])/);
    const transformado = palabras.map(palabra =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    ).join(' ');
    return transformado;
  }

  resetearComponente() {
    setTimeout(() => {
      this.cerrar();
      this.manualEliminado = false;
      this.hayManuales = false;
      this.sinManuales = false;
      this.obtenerCategoriasConManuales()
    }, 1000);
  }
}
