import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpcionesMenuService {

  usuarioId:number;
  datosUsuario:any = {};

  constructor(
    private usuarioService: UsuarioService
  ){
    this.datosUsuario = this.usuarioService.obtenerAccesoSeleccionado()

  }

  obtenerRecurso(url:any){
    let userId = Number(this.usuarioId !== null && this.usuarioId > 0 ? this.usuarioId : 0);
    let sede = (this.datosUsuario.sede !== null && this.datosUsuario.sede.id > 0 ? this.datosUsuario.sede.id : 0);
    let instituto = (this.datosUsuario.colegio !== null && this.datosUsuario.colegio.id > 0 ? this.datosUsuario.colegio.id : 0);
    let jornada = (this.datosUsuario.jornada !== null && this.datosUsuario.jornada.id > 0 ? this.datosUsuario.jornada.id : 0);

    let nivel = this.datosUsuario.perfil.idPerfilNivel !== null ? this.datosUsuario.perfil.idPerfilNivel : -1;
    let vigencia = 2023;
    let municipio = 0;

    url = url.replace(/{{domain}}/g, environment.DOMAIN);
    url = url.replace(/{{userid}}/g, userId);
    url = url.replace(/{{sede}}/g, sede);
    url = url.replace(/{{inst}}/g, instituto);
    url = url.replace(/{{jornada}}/g, jornada);

    let recursoUrl = url;

    if (recursoUrl.includes("http://") || recursoUrl.includes("https://")) {
      if (recursoUrl.includes("ApoyoEscolarBE")) {
        if (nivel === 0) recursoUrl = `${recursoUrl}?inst=0`
        else if (nivel === 2) recursoUrl = `${recursoUrl}?inst=0`
        else recursoUrl = `${recursoUrl}?inst=0&usuario=${userId}&vigencia=${vigencia}&sede=${sede}&jornada=${jornada}`
      } else if (recursoUrl.includes("apex")) {
        recursoUrl = `${instituto},${vigencia}`
      } else if (recursoUrl.endsWith("students")) {
        recursoUrl = recursoUrl + "/index/" + userId + "/" + instituto + "/" + sede + "/" + jornada;
      } else if (recursoUrl.endsWith("administrative/photo/") || recursoUrl.includes("schools/photo")) {
        recursoUrl = recursoUrl + userId + "/" + instituto + "/" + sede + "/" + jornada;
      } else if (recursoUrl.includes("students/observersearch")) {
        recursoUrl = recursoUrl + "/" + userId + "/" + instituto + "/" + sede + "/" + jornada;
      } else {
        if (nivel === 0) recursoUrl = recursoUrl + "?var=central";
        else if (nivel === 2) recursoUrl = recursoUrl + "?var=" + municipio;
        else recursoUrl = recursoUrl + "?var=" + userId + "-" + instituto + "-" + sede + "-" + jornada;
      }
    }

    return recursoUrl
  }

}
