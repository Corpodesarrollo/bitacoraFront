import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContraseniaService } from 'src/app/services/api/contrasenia/contrasenia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.scss']
})
export class RecuperarContraseniaComponent {

  formulario!: FormGroup;
  campoNumericoTocado = false;
  mensajeError = "El número de documento no se encuentra registrado en el sistema."
  textoError = "El Número de Documento no se encuentra registrado en el sistema"
  mensajeExiste: string = '';
  mensajeNoExiste: string = ''
  hayRespuesta : boolean = false;
  noExiste: boolean = false;
  ingresando:boolean = false;
  parrafo1: string = '';
  parrafo2: string = '';

  ngModal = inject(NgbModal);

  cerrar() {
    this.ngModal.dismissAll()
  }

  constructor(private contrasenaService: ContraseniaService, private formBuilder: FormBuilder) {
    this.construirFormularios();
  }

  construirFormularios() {
    this.formulario = this.formBuilder.group({
      numeroUsuario: ['', [Validators.required, Validators.maxLength(15), Validators.pattern('^[0-9]+')]],
    });
  }

  recuperarContrasenia() {
    this.ingresando = true;
    const idUsuario = this.formulario.get('numeroUsuario')?.value;
    this.contrasenaService.recuperarContrasenia(idUsuario).subscribe(
      response => {
        if (response.code === 204) {
          this.hayRespuesta = true;
          if(response.message === this.mensajeError) {
            this.mensajeNoExiste = response.message;
            this.noExiste = true; 
            this.ingresando = false;
          } else if (response.message !== this.mensajeError) {
            this.mensajeExiste = response.message;
            this.noExiste = false;
            this.ingresando = false;

            let partes =  this.mensajeExiste.split("Recuerde");
            this.parrafo1 = partes[0].trim();
            this.parrafo2 = "Recuerde " + (partes[1] || "").trim();

            let regexEmail = /\S+@\S+\.\S+/;
            let correoEncontrado = this.parrafo1.match(regexEmail);

            if (correoEncontrado) {
              this.parrafo1 = this.parrafo1.replace(correoEncontrado[0], `<strong>${correoEncontrado[0]}</strong>`);
          }
          }          
        }
      },
      error => {
        console.error("Se ha presentado un error: ", error);
      }
    );
  }

  validarTocado() {
    this.campoNumericoTocado = true;
  }
}
