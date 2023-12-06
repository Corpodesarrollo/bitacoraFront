import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpcionesMenuService {

  usuarioId:number;
  datosUsuario:any = {};
  listaParamServicio: any[] = [];
  recursoUrl: String;

  constructor(
    private usuarioService: UsuarioService
  ){
    this.datosUsuario = this.usuarioService.obtenerAccesoSeleccionado()
    this.usuarioId = this.usuarioService.obtenerUsuario().id;
  }

  obtenerRecurso(url:any){
    let userId = Number(this.usuarioId !== null && this.usuarioId > 0 ? this.usuarioId : 0);
    let sede = (this.datosUsuario.sede !== null && this.datosUsuario.sede.id > 0 ? this.datosUsuario.sede.id : 0);
    let instituto = (this.datosUsuario.colegio !== null && this.datosUsuario.colegio.id > 0 ? this.datosUsuario.colegio.id : 0);
    let jornada = (this.datosUsuario.jornada !== null && this.datosUsuario.jornada.id > 0 ? this.datosUsuario.jornada.id : 0);

    let nivel = this.datosUsuario.perfil.idPerfilNivel !== null ? this.datosUsuario.perfil.idPerfilNivel : -1;
    let vigencia = (this.datosUsuario.colegio !== null && this.datosUsuario.colegio.vigencia > 0 ? this.datosUsuario.colegio.vigencia : 0);
    let municipio = 0; 
   
    url = url.replace(/{{domain}}/g, environment.DOMAIN);
    url = url.replace(/{{userid}}/g, userId);
    url = url.replace(/{{sede}}/g, sede);
    url = url.replace(/{{inst}}/g, instituto);
    url = url.replace(/{{jornada}}/g, jornada);

    this.recursoUrl = url;

    if (this.recursoUrl.includes("http://") || this.recursoUrl.includes("https://")) {
      if (this.recursoUrl.toLowerCase().includes("apoyoescolarbe")) {
        if (nivel === 0) this.recursoUrl = `${this.recursoUrl}?inst=0`
        
        else if (nivel === 2) this.recursoUrl = `${this.recursoUrl}?inst=0`
        
        else this.recursoUrl = `${this.recursoUrl}?inst=${instituto}&amp;usuario=${userId}&amp;vigencia=${vigencia}&amp;sede=${sede}&amp;jornada=${jornada}`
      
      } else if (this.recursoUrl.toLowerCase().includes("apex")) {
        this.recursoUrl = `${instituto},${vigencia}`
      
      } else if (this.recursoUrl.toLowerCase().endsWith("students")) {
        this.recursoUrl = `${this.recursoUrl}/index/${userId}/${instituto}/${sede}/${jornada}`;

      } else if (this.recursoUrl.toLowerCase().endsWith("administrative/photo/") || this.recursoUrl.toLowerCase().includes("schools/photo")) {
        this.recursoUrl = `${this.recursoUrl}${userId}/${instituto}/${sede}/${jornada}`;
      
      } else if (this.recursoUrl.toLowerCase().includes("students/observersearch")) {
        this.recursoUrl = `${this.recursoUrl}/${userId}/${instituto}/${sede}/${jornada}`;
        
      } else {
        if (nivel === 0) this.recursoUrl = `${this.recursoUrl}?var=central`;

        else if (nivel === 2) this.recursoUrl = `${this.recursoUrl}?var=${municipio}`;

        else this.recursoUrl = `${this.recursoUrl}?var=${userId}-${instituto}-${sede}-${jornada}`;
      }
    } else {
      this.recursoUrl = environment.URL_APOYO_ESCOLAR + this.recursoUrl;
    }

    return this.recursoUrl;
  }

}
