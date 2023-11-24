import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ModalInformacionComponent } from 'src/app/components/modal-informacion/modal-informacion.component';
import { VerPoliticasComponent } from 'src/app/pages/home/politicas-datos-uso/ver-politicas/ver-politicas.component';
import { politicas } from 'src/app/enums/politicas.enum';
import { ApiResponse } from 'src/app/interfaces/politica.interface';
import { PoliticasAceptadas } from 'src/app/interfaces/politicas_aceptadas.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { PoliticasService } from 'src/app/services/api/politicas/politicas.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { environment } from 'src/environments/environment';
import { ModalVerPoliticaComponent } from './modal-ver-politica/modal-ver-politica.component';

@Component({
  selector: 'app-politica-datos',
  templateUrl: './politica-datos.component.html',
  styleUrls: ['./politica-datos.component.scss']
})
export class PoliticaDatosComponent {

  formProteccion!: FormGroup
  usuario: Usuario
  guardandoPoliticas: boolean = false;
  urlPoliticaDatos:string = environment.URL_POLITICA_DATOS

  actualizoPoliticasUso: boolean = false;
  actualizoPoliticasDatos: boolean = false;

  cambioPolitica: boolean = false;
  aceptoPoliticas:boolean = false;
  mostrarAmbasPolitcas:boolean = false;
  mostrarSoloPoliticaUso:boolean = false;
  mostrarSoloPoliticaDatos:boolean = false;

  idPoliticaUso:string;
  idPoliticaDatos:string;

  respuestaPoliticas: any;
  idUsuario: string;

  constructor(
    private formbuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private usuarioService: UsuarioService,
    private politicasServices: PoliticasService,
    private serviciosModal: NgbModal,
  ) {
    this.usuario = this.usuarioService.obtenerUsuario();
    this.idUsuario = this.usuario.id;
    this.construirForm();
    this.cargarPoliticaActiva();
  }

  /**
   * Metodo inicial que valida las politicas
   * 1. Si alguna de las politicas viene reenviar en true, cambie
   * los textos con la badera de cambio Politica
   * 2. Si ambas politicas traen en reenviar true muestre ambos campos
   * 3. Si No trae ambas Politicas en reenviar true, valida que politicx
   * no se debe mostrar
   */
  ngOnInit(){
    let politicas_recibidas = [];
    politicas_recibidas.push(this.respuestaPoliticas[0].data[0])
    politicas_recibidas.push(this.respuestaPoliticas[1].data[0])
    this.cambioPolitica = politicas_recibidas.some((politica:any) =>  politica.reenviar == true);


    let tienenReenviar = politicas_recibidas.every((politica:any) => politica.reenviar == true);

    let aceptoPoliticas = politicas_recibidas.every((politica:any) => politica.aceptada == true)

    if(!tienenReenviar && this.cambioPolitica){
      politicas_recibidas.forEach( (politica:any) => {
        if(politica && politica.reenviar == true && politica.tipoPolitica == politicas.POLITICA_DATOS){
          this.mostrarSoloPoliticaDatos = true;
          this.formProteccion.controls['politica_uso'].clearValidators();
        }
        else if(politica &&  politica.reenviar == true && politica.tipoPolitica == politicas.POLITICA_USO){
          this.mostrarSoloPoliticaUso = true;
          this.formProteccion.controls['politica_datos'].clearValidators()
        }
      })
    }
    else if(tienenReenviar){
      this.cambioPolitica = true;
      this.mostrarAmbasPolitcas = true;
    }
    else if(!aceptoPoliticas){
      this.cambioPolitica = false;
      let noAceptadas = politicas_recibidas.every((politica:any) => politica.aceptada == false)
      if(noAceptadas){
        this.mostrarAmbasPolitcas = true;
        this.cambioPolitica = false;
      }
      else{
        politicas_recibidas.forEach( (politica:any) => {
          if(politica && politica.aceptada == true && politica.tipoPolitica == politicas.POLITICA_DATOS){
            this.mostrarSoloPoliticaDatos = true;
            this.formProteccion.controls['politica_uso'].clearValidators();
          }
          else if(politica &&  politica.aceptada == true && politica.tipoPolitica == politicas.POLITICA_USO){
            this.mostrarSoloPoliticaDatos = true;
            this.formProteccion.controls['politica_datos'].clearValidators()
          }
        })
      }
    }
  }

  construirForm() {
    this.formProteccion = this.formbuilder.group({
      id_usuario: [this.idUsuario],
      politica_datos: [{ value: false, disabled: true }, Validators.requiredTrue],
      politica_uso: [{ value: false, disabled: true }, Validators.requiredTrue]
    })
  }

   /**
   * Cnsultar politica  activa
   */
   cargarPoliticaActiva() {
    this.politicasServices.obtenerPoliticaActiva().subscribe({
      next: (respuesta: ApiResponse) => {
        if (respuesta.code == 200) {
          respuesta.data.forEach((item:any) => {
            if(item.tipoPolitica === politicas.POLITICA_DATOS){
              this.idPoliticaDatos = item.id
            }
            else if(item.tipoPolitica === politicas.POLITICA_USO){
              this.idPoliticaUso = item.id
            }
          })
        }
      },
      error: (error: any) => { console.log(error) }
    })
  }


  cancelar() {
    this.activeModal.close(false);
  }

  guardar() {
    if (this.formProteccion.invalid) {
      Object.values(this.formProteccion.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }
    else {
      this.guardandoPoliticas = true;
      const observables: any[] = [];
      if(this.formProteccion.get('politica_uso').value){
        let politicas_uso = {
          usuario: this.idUsuario,
          idPolitica:this.idPoliticaUso,
          aceptada: this.formProteccion.get('politica_uso').value
        }
        observables.push(this.politicasServices.aceptarPoliticas(politicas_uso));
      }
      if(this.formProteccion.get('politica_datos').value){
        let politicas_datos = {
          usuario: this.idUsuario,
          idPolitica:this.idPoliticaDatos,
          aceptada: this.formProteccion.get('politica_datos').value
        }
        observables.push(this.politicasServices.aceptarPoliticas(politicas_datos));
      }
      console.log(observables);
      if (observables.length > 0) {
        forkJoin(observables).subscribe({
        next: (respuestas: any[]) => {
          let errorEncontrado = false;
          for (const respuesta of respuestas) {
            if (respuesta.code != 200) {
              errorEncontrado = true;
              this.guardandoPoliticas = false
            }
          }
          if (!errorEncontrado) {
            this.activeModal.close(true)
          }
          else if(errorEncontrado){
            const modalError = this.serviciosModal.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
            modalError.componentInstance.informacion = {
              error: true,
              esExitoso: 'error',
              titulo: '¡Error, no se pudo guardar las politicas!',
              mensaje:  'Ocurrio un error, contacte al adminsitrador'
            };
            this.guardandoPoliticas = false
          }
        },
        error: (error) => {
          const modalError = this.serviciosModal.open(ModalInformacionComponent, { size: 'lg', animation: false, backdrop: 'static', centered: true });
          modalError.componentInstance.informacion = {
            error: true,
            esExitoso: 'error',
            titulo: '¡Error, no se pudo guardar las politicas!',
            mensaje:  'Ocurrio un error'
          };
          this.guardandoPoliticas = false
        },
        complete: () => {
          this.guardandoPoliticas = false;
        }
      });
      }

    }
  }

  cambiarPoliticas(politica:string){
    let politica_uso = this.formProteccion.get('politica_uso').value;
    let politica_datos = this.formProteccion.get('politica_datos').value;

    if(politica_uso && politica_datos && this.mostrarAmbasPolitcas){
      this.aceptoPoliticas = true;
    }
    else if(politica_uso && this.mostrarSoloPoliticaUso && !this.mostrarSoloPoliticaDatos){
      this.aceptoPoliticas = true
    }
    else if(politica_datos && this.mostrarSoloPoliticaDatos && !this.mostrarSoloPoliticaUso){
      this.aceptoPoliticas = true
    }
    else{
      this.aceptoPoliticas = false;
    }
  }

  verPolitica(ver_politica: string) {
    if(ver_politica == politicas.POLITICA_DATOS){
      this.formProteccion.controls['politica_datos'].enable()
    }
    else if(ver_politica === politicas.POLITICA_USO){
      const modalPoliticasUso = this.serviciosModal.open(ModalVerPoliticaComponent, {fullscreen: true, windowClass: 'ver-politicas-modal'})
      modalPoliticasUso.componentInstance.idPolitica = this.idPoliticaUso;
      modalPoliticasUso.componentInstance.verPoliticaUso = true;
      modalPoliticasUso.result.then((result) => {
        if(result.acepto === true){
          if(result.tipo_politica === politicas.POLITICA_USO){
             this.formProteccion.controls['politica_uso'].enable()
            }
        }
      })
    }
  }
}
