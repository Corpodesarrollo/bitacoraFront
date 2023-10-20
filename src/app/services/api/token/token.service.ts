import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private cookieService: CookieService,
  ){
  }

  getToken(){
    if (!sessionStorage.getItem('sap_sec')) return false;
    return JSON.parse(sessionStorage.getItem('sap_sec')!);
  }

  async configurarTokenLocal(usuario:any){
    await sessionStorage.setItem('sap_sec', usuario);
  }
}
