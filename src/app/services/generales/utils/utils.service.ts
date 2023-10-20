import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private http: HttpClient
  ) { }

  private menu = new BehaviorSubject<boolean>(false);
  menuMobile$ = this.menu.asObservable();

  private confirmacionMensajeBorrado = new BehaviorSubject<boolean>(false);
  mensajeBorrado = this.menu.asObservable();

  sendConfirmacion(data){
    this.confirmacionMensajeBorrado.next(data)
  }

  toggleMenuMobile(){
    this.menu.next(!this.menu.value)
  }

  dataURItoBlob(dataURI:any) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
  }


}
