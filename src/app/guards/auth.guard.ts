import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/api/usuario/usuario.service';
import { MsalService } from '@azure/msal-angular';
import { TokenService } from '../services/api/token/token.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private servicioUsuario: UsuarioService,
    private serviciosToken: TokenService,
    private cookiesServiec: CookieService,
    private authService: MsalService,
    private router: Router
    ){}


  async borrarDatos(){
    await sessionStorage.clear();
    await sessionStorage.clear();
    await this.cookiesServiec.deleteAll();
    await this.servicioUsuario.removerUsuario();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.serviciosToken.getToken().token;
    const esMicrosoft = this.authService.instance.getAllAccounts().length > 0;
    if(!token){
      if(esMicrosoft){
        this.authService.logout({});
      }
      this.borrarDatos();
      this.router.navigate(['/login'])
      return false
    }
    return true;
  }
}
