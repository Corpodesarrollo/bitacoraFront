import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { TokenService } from '../token/token.service';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { Permiso } from 'src/app/interfaces/permiso.interface';
import { Perms } from 'src/app/interfaces/perrms.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  httpOptions = {};
  private permisosActualizados = new BehaviorSubject<boolean>(true);
  permisosActualizados$ = this.permisosActualizados.asObservable();
  credencialesUsuarios:{usuario:string, contrasenia:string};

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
    const usuarioString = sessionStorage.getItem("sap_acc_sel");
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
    await sessionStorage.removeItem('sap_acc_sel');
    await localStorage.clear();
    await sessionStorage.clear();

    let url = `${environment.URL_APOYO_ESCOLAR}/autenticaPaginas?bandera=0&Hinicio=22&Hfin=6&ext=1&key=-1&cambio= `;
    var nuevaVentana =window.open(url,'_blank','toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=2000, top=2000, width=2, height=2, visible=none');
    nuevaVentana.resizeTo(0, 0);
    nuevaVentana.moveTo(10000, 10000);
    setTimeout(() => {
      nuevaVentana.close();
    }, 2000);

  }

  ingresar(credenciales: any) {
    return this.http.post(`${environment.URL_API}/apoyo/seguridad/login`, credenciales);
  };

  asignarCredenciales(credenciales:{usuario:string, contrasenia:string}){
    this.credencialesUsuarios = credenciales;
  }

  obtenerCredenciales(){
    return this.credencialesUsuarios;
  }

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

  guardarAcceso(acceso:AccesoPerfil) {
    sessionStorage.setItem('sap_acc_sel', JSON.stringify(acceso));
    let data: any = {
      "usuario": this.obtenerUsuario().id,
      "modulo": null,
      "submodulo": null,
      "tipoLog": 5,
      "colegio": acceso.colegio.id,
      "jornada": acceso.jornada.id,
      "sede": acceso.sede.id,
      "perfil": acceso.perfil.id,
      "descripcion": "{\"Inicio de sesi&oacute;n\":\"\"}"
    };
    this.http.post(`${environment.URL_BITACORAS}/apoyo/consultas/insertarBitacora`, data).subscribe((response:any) => {});
  }

  borrarSeleccionColegio() {
    sessionStorage.removeItem('sap_acc_sel');
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

  obtenerPerfilUsuario(){
    const accesoSeleccionado = sessionStorage.getItem('sap_acc_sel');
    if (accesoSeleccionado !== null) {
      return JSON.parse(accesoSeleccionado).perfil;
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

  guardarUnicoRegistro(bandera: any) {
    sessionStorage.setItem('sap_unico', bandera)
  }

  obtenerUnicoRegistro(): boolean {
    const valorEnsessionStorage = sessionStorage.getItem('sap_unico');
    return valorEnsessionStorage === 'true';
  }

  guardarPermisosPerfil(perfilId:number){
    this.setearCabeceras();
    this.permisosActualizados.next(false);
    this.http.get(`${environment.URL_API}/apoyo/usuarios/permisos/${perfilId}`, this.httpOptions).subscribe({
      next: (permisos: {code:number, data:Permiso[], message:string}) => {
        sessionStorage.setItem('sap_perms', JSON.stringify(permisos.data));
        this.permisosActualizados.next(true);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

    obtetenerPermisosPerfil(permisosUsuario: string){
      let perms = sessionStorage.getItem('sap_perms');
      let permisos:Perms[]
      let result = false;
      if (perms) {
        permisos = JSON.parse(perms);
      }
      if (permisos && permisos.length ) {
        result = permisos.some(
          (permiso:Perms) => permiso.nombreGrupoServicio === permisosUsuario
        );
      }
      return result;
    }


}
