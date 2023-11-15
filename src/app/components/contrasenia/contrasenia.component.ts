import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { ContraseniaService } from 'src/app/services/api/contrasenia/contrasenia.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitoCambioComponentC } from '../exito-cambio/exito-cambio.component';
import { ErrorCambioComponentC } from '../error-cambio/error-cambio.component';

@Component({
  selector: 'app-contrasenia',
  templateUrl: './contrasenia.component.html',
  styleUrls: ['./contrasenia.component.scss']
})
export class ContraseniaComponent {
  idUsuario: number = 0;
  contraseniaActual: string = '';
  contraseniaNueva: string = '';
  confirmacionContrasenia: string = '';
  respuestaErronea: string = 'Contraseña actual es invalidad.';
  actualizando: boolean = false;
  verContraseniaActual: boolean = false;
  verContraseniaNueva: boolean = false;
  verConfirmarContrasenia: boolean = false;
  noCoinciden: boolean = false;
  idEnContrasenia: boolean = false;
  contrasenaRepetida: boolean = false;

  formulario!: FormGroup;
  public campoDeshabilitado: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private contrasenaService: ContraseniaService,
    private usuarioService: UsuarioService,
    private servicioModal: NgbModal,) {
    this.idUsuario = this.usuarioService.obtenerUsuario().id;
    this.construirFormularios();
  }

  construirFormularios() {
    this.formulario = this.formBuilder.group({
      numeroUsuario: [{ value: this.idUsuario, disabled: true }],
      contrasenaActual: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      contrasenaNueva: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      contrasenaConfirmada: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    });
  }

  validarContrasenasIguales(event?: any) {
    this.contraseniaNueva = this.formulario.controls['contrasenaNueva'].value;
    this.confirmacionContrasenia = this.formulario.controls['contrasenaConfirmada'].value;
    if (this.contraseniaNueva !== this.confirmacionContrasenia) {
      this.noCoinciden = true;
    }
    else if (this.contraseniaNueva === this.confirmacionContrasenia) {
      this.noCoinciden = false
    }
  }

  validarContrasena(event: any) {
    this.contraseniaNueva = this.formulario.controls['contrasenaNueva'].value;
    if (this.contraseniaNueva.includes(this.idUsuario.toString())) {
      this.idEnContrasenia = true;
    } else {
      this.idEnContrasenia = false
      this.validarRepetidas()
    }
  }

  validarRepetidas() {
    this.contrasenaRepetida = false;
    let contrasenaNueva = this.formulario.controls['contrasenaNueva'].value;
    let contrasenaActual = this.formulario.controls['contrasenaActual'].value;
    if (contrasenaNueva === contrasenaActual) {
      this.contrasenaRepetida = true;
    }
    else if(this.confirmacionContrasenia){
      this.validarContrasenasIguales()
    }
    else {
      this.contrasenaRepetida = false;
    }
  }

  campoNoValido(campo: string) {
    return this.formulario.get(campo)?.invalid && this.formulario.get(campo)?.touched;
  }

  cambiarContrasenia(){
    this.contraseniaActual = this.formulario.controls['contrasenaActual'].value;
    this.contraseniaNueva = this.formulario.controls['contrasenaNueva'].value;
    this.confirmacionContrasenia = this.formulario.controls['contrasenaConfirmada'].value;
    this.actualizando = true;

    this.contrasenaService.cambiarContrasenia(this.idUsuario, this.contraseniaActual, this.contraseniaNueva, this.confirmacionContrasenia).subscribe(
      res => {
        if (res.message === this.respuestaErronea) {
          this.servicioModal.open(ErrorCambioComponentC, { size: '600px', centered: true, animation: false, backdrop: 'static' });
          this.actualizando = false;
        } else {
          this.servicioModal.open(ExitoCambioComponentC, { size: '600px', centered: true, animation: false, backdrop: 'static' });
          this.actualizando = false;
        }
      },
      err => {
        console.error(err);
        this.servicioModal.open(ErrorCambioComponentC, { size: '600px', centered: true, animation: false, backdrop: 'static' });
        this.actualizando = false;
      }
    );
  }

  mostrarContrasenia() {
    this.verContraseniaActual = !this.verContraseniaActual;
  }

  mostrarContraseniaNueva() {
    this.verContraseniaNueva = !this.verContraseniaNueva;
  }

  mostrarConfirmarContrasenia() {
    this.verConfirmarContrasenia = !this.verConfirmarContrasenia;
  }

  noCopiarPegar(event: ClipboardEvent) {
    event.preventDefault();
  }
}
