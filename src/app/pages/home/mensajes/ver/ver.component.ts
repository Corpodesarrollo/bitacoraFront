import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.scss']
})
export class VerComponent implements OnInit{
  mensaje:any = {} ;
  id: any;
  usuarioLogueado: any;

  constructor(private activatedRoute: ActivatedRoute,
              private mensajesService: MensajesService,
              private usuarioService: UsuarioService){
                this.usuarioLogueado = this.usuarioService.obtenerUsuario();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params=>{
      this.id = params['id'];
    })
    this.obtenerMensajes();
  }

  obtenerMensajes(){

    this.mensajesService.obtenerMensaje(this.id).subscribe((resp:any)=>{
      this.mensaje = resp.data;
      //console.log(resp)
    })

  }

}
