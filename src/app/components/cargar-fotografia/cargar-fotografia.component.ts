import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CamaraComponent } from 'src/app/components/camara/camara.component';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { UtilsService } from 'src/app/services/generales/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cargar-fotografia',
  templateUrl: './cargar-fotografia.component.html',
  styleUrls: ['./cargar-fotografia.component.scss']
})
export class CargarFotografiaComponent {

  @Input()traeBotones: boolean = true;
  @Input()traeMensaje: boolean = false;
  @Input()fotoUsuario: any;
  @Input()identificacion: any;
  @Input()estaActivo: any;
  @Output() actualizarFoto = new EventEmitter();
  @Output() esFotografia = new EventEmitter(false);

  urlFoto = ''
  urlNuevaFoto:string = '';
  fotoPrevisualizada:any;
  formatosImagenes:string = '';
  nombreArchivo:string = '';
  esTomada:boolean = false;
  public subirFotografia:any;

  serviciosUsuario = inject(UsuarioService)
  sanitizer = inject(DomSanitizer)

  mensaje = {
    titulo: '¡RECUERDE!',
    informacion: 'Solo se permiten imágenes en formato BMP, JPG y PNG.  Tamaño máximo de archivo 1 mb.',
    error: false
  }

  constructor(
    private servicioModal: NgbModal,
    private utilitiesServices: UtilsService
    ){}

  ngOnInit(){
    let perfilUsuario = this.serviciosUsuario.obtenerPerfilUsuario().nombre;
    if(perfilUsuario === 'docente'){
      this.traeBotones = true
    }
    this.formatosImagenes = environment.formatos_imagen_validos.toString();
    this.urlFoto = this.fotoUsuario
  }

    /**
   * Metodo que al seleccionar el archivo lo valida y si está correcto lo aasigna para enviarlo posteriormente
   * @param evento
   * @returns
   */
    cambiarFoto(evento: any){
      let foto = evento.target.files[0]
      this.traeMensaje = false;
      this.urlNuevaFoto = '';
      this.nombreArchivo = '';
      this.fotoUsuario = ''
      this.actualizarFoto.emit(this.fotoUsuario)
      this.fotoPrevisualizada = false;
      if( !foto ) return false;
      let fotoName = foto.name.split(".");
      let nombreArchivo = fotoName[0];
      let tipoArchivo = this.obtenerTipo(foto)
      if(nombreArchivo === this.identificacion.toString() && fotoName.length==2){
        if(environment.formatos_imagen_validos.includes(`image/${tipoArchivo}`)){
          if(foto.size > environment.tamano_imagen){
            this.traeMensaje = true;
            this.fotoPrevisualizada = false
            this.nombreArchivo = ''
              this.mensaje = {
                titulo: "¡Error!",
                informacion: 'El tamaño máximo permitido es de 1 MB.',
                error: true
              };
              return false;
            }
            else{
              this.extraerBase64(foto).then((imagen: any) => {
                this.fotoPrevisualizada = true;
                this.urlNuevaFoto = imagen.base
              });
              this.traeMensaje = false;
              this.fotoUsuario = foto
              this.nombreArchivo = foto.name
              this.actualizarFoto.emit(this.fotoUsuario)
              evento.target.value = '';
              return true
            }
          }
          else{
          this.traeMensaje = true;
          this.fotoPrevisualizada = false
          this.nombreArchivo = ''
          this.mensaje = {
            titulo: "¡Error!",
            informacion: 'El formato de imagen debe ser BMP, JPG y PNG.',
            error: true
          };
          return false;
        }
      }
      else{
        this.traeMensaje = true;
        this.fotoPrevisualizada = false
        this.nombreArchivo = ''
        this.mensaje = {
          titulo: "¡Error!",
          informacion: 'Por favor, valide el nombre del archivo, porque debe coincidir con el número de documento de identidad y no debe tener carácteres especiales',
          error: true
        };
        return false;
      }
    }


  /**
   * metodo para extraer la base 64 del archivo caargado.
   * @param $event
   * @returns
   */
  extraerBase64 = async ($event: any) =>
  new Promise((resolve) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const imagen = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result,
        });
      };
      reader.onerror = (error) => {
        resolve({
          blob: $event,
          imagen,
          base: null,
        });
      };
    } catch (e) {
      return null;
    }
    return null;
  });

  obtenerTipo(file: File): string {
    let sp = file.name.split('.');
    let ext = sp[sp.length - 1];
    return ext
  }

  /**
   * Metodo que se ejecuta al momento
   * de tomar la fotografia.
   */
  tomarFoto(){
      this.urlNuevaFoto = ''
      this.fotoPrevisualizada = false
      const modalCamara = this.servicioModal.open(CamaraComponent, {size: 'xl', centered: true, animation:false, backdrop: 'static'});
      modalCamara.componentInstance.emitService.subscribe((emmitedValue:any) => {
        this.nombreArchivo = `${this.identificacion}.jpg`
        this.traeMensaje = false;
        this.fotoPrevisualizada = true;
        this.urlNuevaFoto = emmitedValue;
        let photo = this.utilitiesServices.dataURItoBlob(emmitedValue);
        this.fotoUsuario = new File([photo], this.nombreArchivo)
        this.esTomada = true
        this.actualizarFoto.emit(this.fotoUsuario)
        this.esFotografia.emit(this.esTomada)
      });
    }
}
