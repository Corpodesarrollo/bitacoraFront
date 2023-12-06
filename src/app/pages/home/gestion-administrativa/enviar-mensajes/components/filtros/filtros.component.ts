import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajesService } from 'src/app/services/api/mensajes/mensajes.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { MensajeModal } from '../mensaje-modal/mensaje-modal';
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';


@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss']
})
export class FiltrosComponent {

  @Output() filtros = new EventEmitter<any>();

  formularioFiltros!: FormGroup;

  listaPerfiles: any[] = [
    { 'perfilId': 1, 'perfil': 'estudiante' }
  ]

  listadoPerfiles: any[] = [];
  listadoLocalidades: any[] = [];
  listadoColegios: any[] = [];

  colegio_id: any;
  datosUsuario: AccesoPerfil;

  diasDiferencia!: number;

  parametrosFiltros = {
    perfilId: "",
    localidad_id: "",
    colegio_id: "",
    fecha_inicio: "",
    fecha_final: ""
  }
  deshabilitarSelectColegio: boolean;
  infoUsuariologueado: any;
  infoLocalidadId: any;
  deshabilitarSelectLocalidad: boolean;


  constructor(private mensajesService: MensajesService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private personalService: PersonalService,
    private servicioModal: NgbModal) {
    this.datosUsuario = this.usuarioService.obtenerAccesoSeleccionado();
    this.infoUsuariologueado = this.usuarioService.obtenerUsuarioPerCol();
    this.construirFormulario();
    this.cargarListados();
    if (this.datosUsuario.perfil.id == 410 || this.datosUsuario.perfil.id == 460 || this.datosUsuario.perfil.id == 423 || this.datosUsuario.perfil.id == 421 || this.datosUsuario.perfil.id == 422 || this.datosUsuario.perfil.id == 420 || this.datosUsuario.perfil.id == 424) {
      this.cargarInfoRector()
    }
  }

  construirFormulario() {
    this.formularioFiltros = this.formBuilder.group({
      perfil_id: [null],
      localidad_id: [null],
      colegio_id: [null],
      fecha_inicio: [null, [Validators.required]],
      fecha_final: [null, [Validators.required]]
    })
  }


  /**
* Verifica si un campo es valido del formulario de plan
* @param campo
* @returns
*/
  campoNoValido(campo: string) {
    return this.formularioFiltros.get(campo)?.invalid && this.formularioFiltros.get(campo)?.touched;
  }

  async cargarInfoRector() {
    try {
      // this.cargandoDatosRector = true;      
      this.formularioFiltros.patchValue({
        colegio_id: this.infoUsuariologueado.colegio.id,
        localidad_id: this.infoUsuariologueado.localidad.id
      });

      console.log(this.infoLocalidadId)
      if (this.infoLocalidadId) {
        this.obtenerListadoColegios(this.infoLocalidadId);
      }

      this.mensajesService.obtenerColegios(this.infoUsuariologueado.localidad.id).subscribe((resp: any) => {
        if (resp.data.length == 0) {
          this.listadoColegios = [{
            id: 0, nombre: 'SIN INFORMACION'
          }]
        } else {
          this.listadoColegios = resp.data;
        }
      })
      
      this.formularioFiltros.controls['localidad_id'].disable();
      this.formularioFiltros.controls['colegio_id'].disable();
      this.deshabilitarSelectColegio = false;
      this.deshabilitarSelectLocalidad = false;


    } catch (error) {
      // this.cargandoDatosRector = false;
    }
  }

  cargarListados() {

    // Listado localidad

    this.obtenerPerfiles();
    this.obtenerListadoLocalidades();

    this.formularioFiltros.controls['colegio_id'].disable();
    this.deshabilitarSelectColegio = true;

  }

  // Peticiones a servicios

  obtenerPerfiles() {
    this.personalService.obtenerPerfilesPorTipo().subscribe((resp: any) => {
      this.listadoPerfiles = resp.data;
      // console.log(resp)
    })
  }

  obtenerListadoLocalidades() {
    this.mensajesService.obtenerLocalidades().subscribe((resp: any) => {
      this.listadoLocalidades = resp.data;
    });
  }

  obtenerListadoColegios(localidad_id: any) {
    this.mensajesService.obtenerColegios(localidad_id).subscribe((resp: any) => {
      if (resp.data.length == 0) {
        this.listadoColegios = [{
          id: 0, nombre: 'SIN INFORMACION'
        }]
      } else {
        this.listadoColegios = resp.data;
      }
    })
  }

  localidadSeleccionado(infoLocalidad: any) {
    // console.log(infoLocalidad)
    this.infoLocalidadId = infoLocalidad
    this.formularioFiltros.controls['colegio_id'].enable();
    this.deshabilitarSelectColegio = false;
    if (infoLocalidad) {
      this.obtenerListadoColegios(infoLocalidad);
    }
  }

  obtenerDistaniaFechas(fecha_inicio: any, fecha_final: any) {
    //console.log(fecha_inicio, fecha_final)
    const fechaDesde = new Date(fecha_inicio);
    const fechaHasta = new Date(fecha_final);
    fechaDesde.setDate(fechaDesde.getDate() - 1);
    fechaHasta.setDate(fechaHasta.getDate() + 1);
    let diferenciaFechas = fechaHasta.getTime() - fechaDesde.getTime();
    this.diasDiferencia = (diferenciaFechas / 1000 / 60 / 60 / 24) - 1;
    //console.log(this.diasDiferencia)
  }

  buscar() {
    const inicio = this.formularioFiltros.get('fecha_inicio')?.value;
    const final = this.formularioFiltros.get('fecha_final')?.value;

    if (!inicio || !final) {
      this.formularioFiltros.markAllAsTouched();
      let infoMensaje: any = {}
      infoMensaje.titulo = 'Error';
      infoMensaje.ventanaEnviado = true;
      infoMensaje.mensaje = 'Verifique que el formulario este bien diligenciado';
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = infoMensaje;
    }

    let fecha_inicio = `${inicio.year}-${(inicio.month < 10 ? '0' : '').concat(inicio.month)}-${(inicio.day < 10 ? '0' : '').concat(inicio.day)}`;
    let fecha_final = `${final.year}-${(final.month < 10 ? '0' : '').concat(final.month)}-${(final.day < 10 ? '0' : '').concat(final.day)}`;
    //console.log(fecha_inicio, fecha_final)

    this.obtenerDistaniaFechas(fecha_inicio, fecha_final);

    if (fecha_inicio == "null-0null-0null") {
      fecha_inicio = "";
    } else if (fecha_final == "null-0null-0null") {
      fecha_final = "";
    }

    this.parametrosFiltros.fecha_inicio = fecha_inicio;
    this.parametrosFiltros.fecha_final = fecha_final;
    this.parametrosFiltros.colegio_id = this.formularioFiltros.get('colegio_id')?.value;
    this.parametrosFiltros.localidad_id = this.formularioFiltros.get('localidad_id')?.value;
    this.parametrosFiltros.perfilId = this.formularioFiltros.get('perfil_id')?.value;

    if (this.formularioFiltros.status == "VALID") {
      if (this.diasDiferencia > 0) {
        this.obtenerDistaniaFechas(fecha_inicio, fecha_final);
        this.filtros.emit(this.parametrosFiltros);
      } else {
        // this.actualizando = false;
       
      this.formularioFiltros.markAllAsTouched();
      let infoMensaje: any = {}
      infoMensaje.ventanaEnviado = true;
      infoMensaje.titulo = 'Error';
      infoMensaje.mensaje = 'La fecha finalización es menor a la fecha inicio.';
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = infoMensaje;
      }
    } else {
      this.formularioFiltros.markAllAsTouched();
      let infoMensaje: any = {}
      infoMensaje.titulo = 'Error';
      infoMensaje.ventanaEnviado = true;
      infoMensaje.mensaje = 'Verifique que el formulario este bien diligenciado';
      const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
      modalRef.componentInstance.infoMensaje = infoMensaje;
      // modalRef.result.then(() => {
      //   console.log('cerrado modal');
      // })
    }


  }

  // /home/gestion-administrativa/editar

}
