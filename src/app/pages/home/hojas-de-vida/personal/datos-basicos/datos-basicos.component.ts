import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalService } from 'src/app/services/api/personal/personal.service';

@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['./datos-basicos.component.scss']
})
export class DatosBasicosComponent {


  //Modal
  idUsuario:number = 0;
  modalAbierto:boolean = false;
  esDocente:boolean = false;
  perfilUsuario:any = []

  formDatosUsuario!: FormGroup;
  actualizando:boolean = false;
  tiposIdentificacion:any = [];
  fotoUsuario:string = 'assets/img/foto_default_editar.svg'

  constructor(
    private formBuilder:FormBuilder,
    private personalServices: PersonalService
  ){

    this.construirFormularios();
    this.cargarListas();
  }

  construirFormularios(){
    this.formDatosUsuario = this.formBuilder.group({
      tipo_identificacion: [{value: null, disabled: true}],
      numero_identificacion: [{value: '', disabled: true}],
      apellidos: [{value: '', disabled: true} ],
      nombres: [{value: '', disabled: true}],
      cargo: [{value: '', disabled: true}],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@educacionbogota.edu\\.co|educacionbogota\\.gov\\.co$')]],
    })


    this.perfilUsuario = JSON.parse(localStorage.getItem('usuario_sae')!)
    console.log(this.perfilUsuario);
  }

  campoNoValido(campo:string){
    return this.formDatosUsuario.get(campo)?.touched && this.formDatosUsuario.get(campo)?.invalid
  }


  cargarListas(){
    this.personalServices.obtenerTiposIdentificacion().subscribe({
      next: (respuesta:any) => {
        if(respuesta.status = 200){
          this.tiposIdentificacion = respuesta.data;
        }
      },
      error: (error) => console.log(error)
    })

  }

}
