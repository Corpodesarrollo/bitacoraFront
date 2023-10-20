import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsultasService } from 'src/app/services/api/consultas/consultas.service';
import { UtilsService } from 'src/app/services/generales/utils/utils.service';
import { ModalErroresCamposComponent } from '../../../components/modal-errores-campos/modal-errores-campos.component';


@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent {

  tiposDocumentos!: any[]
  formBuscar!: FormGroup;
  formCertificado!: FormGroup;
  formPin!: FormGroup;
  mostrarErrorPin:boolean = false;

  /**
   * Variables para las listas de los select;
   */
  metodologiasEstudiante:any;
  colegioEstudiante: any;
  sedeEstudiante: any;
  jornadaEstudiante: any;
  gradoEstudiante: any;
  grupoEstudiante: any;
  periodoEstudiante: any;

  buscandoEstudiante:boolean = false;
  estudianteEncontrado:boolean = false;
  generandoCertificado:boolean = false;
  generandoConsultaExterna:boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private servicioModal: NgbModal,
    private serviciosConsulta: ConsultasService,
    private utilsService: UtilsService,

  ){
    this.cargarListas();
    this.construirFormularios();
  }


  cargarListas(){

    this.serviciosConsulta.obtenerTiposDocumento().subscribe({
      next:(respuesta:any) =>{
        if(respuesta.code == 200){
          this.tiposDocumentos = respuesta.data
        }
      },
      error:(error:any)=>{
        console.log(error);
      }
    })
  }

  ngOnInit(){
    this.formBuscar.get('numero_documento')?.valueChanges.subscribe(() => {
      this.estudianteEncontrado = false;
    });
    this.formBuscar.get('codigo_estudiante')?.valueChanges.subscribe(() => {
      this.estudianteEncontrado = false;
    });
  }

  /**
   * Crear formularios
   */
  construirFormularios(){
    this.formBuscar = this.formBuilder.group({
      tipo_documento: [null, Validators.required],
      numero_documento: ['', [
        Validators.required,  Validators.pattern('^[0-9]+$')]],
      codigo_estudiante: ['', [
        Validators.required,  Validators.pattern('^[0-9]+$')
      ]]
    })

    this.formCertificado = this.formBuilder.group({
      tipo_documento: [''],
      numero_documento: [''],
      codigo_estudiante: [''],
      nombre_estudiante: [''],
      colegio: [''],
      sede: [null],
      jornada: [null],
      metodologia: [null],
      grado: [null],
      grupo: [null],
      periodos: [null, Validators.required],
    })

    this.formPin = this.formBuilder.group({
      numero_pin : ['',[Validators.required, Validators.maxLength(15)]]
    })
  }

  /**
   * Campos no validos
   */
  campoNoValidoBoletines(campo:string){
    return this.formBuscar.get(campo)?.invalid && this.formBuscar.get(campo)?.touched;
  }

  campoNoValidoCertificado(campo:string){
    return this.formCertificado.get(campo)?.invalid && this.formCertificado.get(campo)?.touched;
  }

  campoNoValidoPines(campo:string){
    return this.formPin.get(campo)?.invalid && this.formPin.get(campo)?.touched;
  }


  /**
   * Buscar el estudiante para
   * generar el certificado
   * acorde al periodo.
   */
  buscarEstudiante(){
    this.estudianteEncontrado = false;
    if (this.formBuscar.invalid) {
      Object.values(this.formBuscar.controls).forEach((control: any) => {
        control.markAsTouched();
      });

      let nombresErrores:any = {
        tipo_documento: 'Tipo de Documento',
        numero_documento: 'Número de documento',
        codigo_estudiante: 'Código del estudiante',
      }
      const camposConErrores = Object.keys(this.formBuscar.controls).filter(
        (campo) => this.formBuscar.controls[campo].invalid
      );
      const listaErrores = camposConErrores.map(
        (campo) => nombresErrores[campo] || campo
      );
      const modalRef = this.servicioModal.open(ModalErroresCamposComponent,{ size: 'lg', centered: true,  animation: false, backdrop: 'static'});
      modalRef.componentInstance.titulo = 'Error en el formulario.'
      modalRef.componentInstance.lista_errores = listaErrores;
    } else {
      this.buscandoEstudiante = true;
      let parametros = {
        tipoDocumento: this.formBuscar.get('tipo_documento')
          ?.value,
          numeroDocumento: this.formBuscar.get('numero_documento')
          ?.value,
          codigoEstudiante: this.formBuscar.get('codigo_estudiante')
        ?.value,
      };
      this.serviciosConsulta.obtenerEstudiante(parametros).subscribe({
        next: (respuesta: any) => {
          if (respuesta.code === 200){
            this.formBuscar.reset();
            this.buscandoEstudiante = false;
            this.estudianteEncontrado = true;
            let estudiante = respuesta.data
            this.sedeEstudiante = [estudiante.sede];
            this.colegioEstudiante = [estudiante.institucion];
            this.jornadaEstudiante = [estudiante.jornada];
            this.metodologiasEstudiante = [estudiante.metodologia];
            this.gradoEstudiante = [estudiante.grado];
            this.grupoEstudiante = [estudiante.grupo];
            this.periodoEstudiante = estudiante.periodos;
            this.formCertificado.patchValue({
              nombre_estudiante: estudiante.nombreEstudiante,
              colegio: estudiante.institucion.id,
              sede: estudiante.sede.id,
              jornada: estudiante.jornada.id,
              metodologia: estudiante.metodologia.id,
              grado: estudiante.grado.id,
              grupo: estudiante.grupo.id,
            })
          }
          else{
            this.buscandoEstudiante = false
            const modalRef = this.servicioModal.open(ModalErroresCamposComponent,{ size: 'md', centered: true,  animation: false, backdrop: 'static'});
            console.log(respuesta.message);
            modalRef.componentInstance.lista_errores = [respuesta.message];
            modalRef.componentInstance.titulo = 'Error en la busqueda.'
            modalRef.componentInstance.candidatoNoEncontrado = true
          }
        },
        error: (error: Error) => {
          this.buscandoEstudiante = false
          const modalRef = this.servicioModal.open(ModalErroresCamposComponent,{ size: 'md', centered: true,  animation: false, backdrop: 'static'});
          modalRef.componentInstance.titulo = 'Error en la busqueda.'
          modalRef.componentInstance.candidatoNoEncontrado = true
        },
      });
    }
  }

  /**
   * Metodo para generar el certificado del estudiante
   */
  generarCertificado(){
    if (this.formCertificado.invalid) {
      Object.values(this.formCertificado.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    }else{
      this.generandoCertificado = true;
      setTimeout(()=>{
        this.estudianteEncontrado = false;
        this.generandoCertificado = false;
        this.formBuscar.reset();
        this.formCertificado.reset();
        alert('Certificamdo simulado generado');
      }, 2000)
   /*    this.serviciosConsulta.generarBoletin(this.estudianteId).subscribe({
        next:(respuesta:any) =>{
          if(respuesta.exito){
            this.generandoCertificado = false;
          }
          else{
            this.generandoCertificado = false
            const modalRef = this.servicioModal.open(ErrorComponent,{ size: 'lg', centered: true,  animation: false, backdrop: 'static'});
            modalRef.componentInstance.campo_error = respuesta.error;
          }
        },
        error: (error: Error) => {
          this.generandoCertificado = false
          const modalRef = this.servicioModal.open(ErrorComponent,{ size: 'lg', centered: true,  animation: false, backdrop: 'static'});
        },
      }) */
    }
  }

  /**
   * Generar consulta exter
   * a traves de validar el pin
   */
  generarConsultaExterna(){
    if (this.formPin.invalid) {
      Object.values(this.formPin.controls).forEach((control: any) => {
        control.markAsTouched();
        this.generandoConsultaExterna = false;
      });
      this.mostrarErrorPin = true;
    }else{
      this.generandoConsultaExterna = true
      let pin = this.formPin.get('numero_pin')?.value;
      this.serviciosConsulta.validarPin(pin).subscribe({
        next:(respuesta:any)=>{
          if(respuesta.status === 200){
            this.generandoConsultaExterna = false;
            window.location.href = respuesta.url;
          }
        },
        error: (error) =>{
          console.log(error);
          this.generandoConsultaExterna = false;
          const modalRef =this.servicioModal.open(ModalErroresCamposComponent, {size: 'md', centered: true, animation: false, backdrop: 'static'})
          modalRef.componentInstance.titulo = 'Error al generar consulta'
          modalRef.componentInstance.lista_errores = ['No se encontró consulta con el pin enviado.']
          modalRef.componentInstance.candidatoNoEncontrado = true
        }
      })
    }
  }
}
