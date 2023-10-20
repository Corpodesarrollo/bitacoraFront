import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/classes/usuario.interface';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';

@Component({
  selector: 'app-politica-datos',
  templateUrl: './politica-datos.component.html',
  styleUrls: ['./politica-datos.component.scss']
})
export class PoliticaDatosComponent {

  formProteccion!:FormGroup
  idUsuario: string;
  usuario:Usuario
  guardandoPoliticas:boolean = false;
  actualizoPoliticasUso:boolean = false;
  actualizoPoliticasDatos:boolean = false;
  cambioPolitica:boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private usuarioService: UsuarioService,
    private ActivateRoute: ActivatedRoute,
    private router: Router
  ){
    this.usuario = this.usuarioService.obtenerUsuario();
    this.idUsuario = this.usuario.id;
    this.construirForm()
    sessionStorage.setItem('tiene_politica', 'true')
  }

  construirForm(){
    this.formProteccion = this.formbuilder.group({
      id_usuario: [this.idUsuario],
      politica_datos: [false, Validators.requiredTrue],
      politica_uso: [false, Validators.requiredTrue]
    })
  }

  cancelar(){
    this.activeModal.close()
  }

  guardar(){
    if (this.formProteccion.invalid) {
      Object.values(this.formProteccion.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
    else{
      this.guardandoPoliticas = true;
     /*  this.serviciosPoliticas. */
      //Todo validar el servicio
     /* if(result){
        this.router.navigate(['login/seleccionar-perfil']);
      }
      else{
        this.servicioUsuario.cerrarSesion(this.esMicrosoft)
      } */
    }
  }

  verPolitica(){
    this.activeModal.dismiss();
    this.router.navigate(['login/visualizar-politicas'])
  }
}
