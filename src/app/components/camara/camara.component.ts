import { Component, EventEmitter, NgZone, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperComponent } from 'angular-cropperjs/lib/cropper/cropper.component';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
/* import { CropperComponent } from 'angular-cropperjs/lib/cropper/cropper.component'; */


@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.scss']
})
export class CamaraComponent {

  @ViewChild("croppedImage") croppedImage: CropperComponent| undefined;
  @ViewChild("modalError") modalError: any;
  @Output() emitService = new EventEmitter();
  imagenFinal:any;
  alturaCamara= 480;
  anchoCamara = 640;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  // latest snapshot
  public webcamImage: WebcamImage | undefined;


  constructor(
    private modal: NgbModal,
    private activeModal: NgbActiveModal,
    private ngZone:NgZone
  ){
    window.onresize = (e) =>
    {
        //ngZone.run will help to run change detection
        this.ngZone.run(() => {
          if(window.innerWidth<576){
            this.anchoCamara = 270;
            this.alturaCamara = 520;
          }
          if(window.innerHeight > 576 && window.innerWidth < 992){
            this.anchoCamara = 300;
            this.alturaCamara = 460;
          }
        });
    };
  }

  public ngOnInit(): void {
    if(window.innerWidth<576){
      this.anchoCamara = 270;
      this.alturaCamara = 520;
    }
  }

  /**
   * Metodo que se ejecuta si hay un erro al iniciar
   * @param error
   */
  errorAlIniciar(error: WebcamInitError): void {
    console.log(error);
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      this.modal.open(this.modalError,{ size: 'md', centered: true,  animation: false, backdrop: 'static', windowClass: 'modal_login'});
      this.activeModal.close();
    }
  }


  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public handleImage(webcamImage: any): void {
    this.webcamImage = webcamImage;
  }

  enviarFoto(){
    this.imagenFinal = this.croppedImage?.cropper.getCroppedCanvas().toDataURL();
    this.emitService.emit(this.imagenFinal);
    this.activeModal.close();
  }

  cancelar(){
    this.activeModal.close();
  }
}
