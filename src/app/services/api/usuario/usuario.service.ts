import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  httpOptions = {};

  constructor(
    private http: HttpClient,
    private authService: MsalService,
    private router: Router,
    private tokenService: TokenService
  ) {
  }


  setearCabeceras(){
    this.httpOptions = {
    headers: new HttpHeaders({
       'Content-Type': `${environment.CONTENT_TYPE}`,
       "Authorization": (this.tokenService.getToken().token)?`Bearer ${this.tokenService.getToken().token}`:''
    })
    };
 }


  obtenerUsuarioPerCol() {
    const usuarioString = sessionStorage.getItem("sap_sec_percol");
    if (!usuarioString) return false;
    const usuario = JSON.parse(usuarioString);
    return usuario;
  }

  obtenerUsuario() {
    const usuarioString = sessionStorage.getItem("sap_sec_user");
    if (!usuarioString) return false;
    const usuario = JSON.parse(usuarioString);
    return usuario;
  }

  async configurarUsuario(usuario: any) {
    await sessionStorage.setItem("sap_sec_user", usuario);
  }

  async removerUsuario() {
    await sessionStorage.removeItem("sap_sec_user");
    await sessionStorage.removeItem("sap_sec");
    await sessionStorage.clear();
  }

  async cerrarSesion(esMicrosoft: boolean) {
    if (esMicrosoft) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: "#/login"
      });
    }
    else {
      this.router.navigate(['login'])
    }
    await sessionStorage.removeItem("sap_sec_user");
    await sessionStorage.removeItem("sap_sec");
    await sessionStorage.removeItem('sap_sec_percol');
    await localStorage.clear();
    await sessionStorage.clear();
  }

  ingresar(credenciales: any) {
    return this.http.post(`${environment.URL_API}/apoyo/seguridad/login`, credenciales);
  };

  obtenerMenu(parametros: any) {
    this.setearCabeceras();
    return this.http.get(`${environment.URL_API}/menu/allmenu/${parametros.institucion_id}/${parametros.perfil_id}`, this.httpOptions);
  }

  obtenerInfoUsuario(id: any): Observable<any> {
    this.setearCabeceras();
    return this.http.get<any>(`${environment.URL_API}/apoyo/usuarios/${id}/info-usuario`, this.httpOptions);
  }

  validarUsuario(usuario: string) {
    return this.http.get(`${environment.URL_API}/apoyo/seguridad/usuarios/${usuario}`);
  }

  guardarSeleccionColegio(colegio_guardado?: string, sede_guardada?: string, jornada_guardada?: string, foto_ie?: string, rol_usuario?: string, etiqueta?: string, idColegio?: number, idSede?: number, idJornada?: number, idPerfil?: number, localidadNombre?: string, idLocalidad?: number) {
    const sap_sec_percol = {
      colegio: {
        idColegio,
        colegio_guardado
      },
      sede: {
        idSede,
        sede_guardada
      },
      localidad: {
        idLocalidad,
        localidadNombre
      },
      jornada: {
        idJornada,
        jornada_guardada
      },
      perfil: {
        idPerfil,
        rol_usuario,
        etiqueta
      },
      foto_ie,
    };

    sessionStorage.setItem('sap_sec_percol', JSON.stringify(sap_sec_percol));
  }

  borrarSeleccionColegio() {
    sessionStorage.removeItem('sap_sec_percol');
  }

  //obtenerPerfilUsuario
  obtenerAccesoSeleccionado() {
    const accesoSeleccionado = sessionStorage.getItem('sap_acc_sel');
    if (accesoSeleccionado !== null) {
      return JSON.parse(accesoSeleccionado);
    } else {
      return null;
    }
  }

  obtenerPerfilUsuario() {
    const institutoGuardado = sessionStorage.getItem('sap_sec_percol');
    if (institutoGuardado !== null) {
      return JSON.parse(institutoGuardado);
    } else {
      return null;
    }
  }

  obtenerRolUsuario(){
    const institutoGuardado = sessionStorage.getItem('sap_sec_percol');
    if (institutoGuardado !== null) {
      return JSON.parse(institutoGuardado).perfil.rol_usuario;
    } else {
      return null;
    }
  }

  guardarInfoCargada(usuario_sae: any) {
    sessionStorage.setItem('usuario_sae', JSON.stringify(usuario_sae));
  }

  obtenerInfoGuardada() {
    const usuario_sae_str = sessionStorage.getItem('usuario_sae');
    if (usuario_sae_str) {
      return JSON.parse(usuario_sae_str);
    }
    return null;
  }

  gaurdarUnicoRegistro(registro: any) {
    sessionStorage.setItem('unicoRegistro', registro)
  }

  obtenerUnicoRegistro(): boolean {
    const valorEnsessionStorage = sessionStorage.getItem('unicoRegistro');
    return valorEnsessionStorage === 'true';
  }


}
