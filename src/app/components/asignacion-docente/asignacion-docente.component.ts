import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AsignacionAcademicaService } from 'src/app/services/api/personal/asignacion-academica.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { MensajeModal } from '../../pages/home/hojas-de-vida/personal/asignacion-academica/components/mensaje-modal/mensaje-modal';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { ConfiguracionGeneral } from 'src/app/enums/general.enum'
import { PersonalService } from 'src/app/services/api/personal/personal.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-asignacion-docente',
  templateUrl: './asignacion-docente.component.html',
  styleUrls: ['./asignacion-docente.component.scss']
})
export class AsignacionDocenteComponent implements OnInit{

  @Input() infoFuncionario: any;

  asignacionAcademicaService = inject(AsignacionAcademicaService);
  usuarioService = inject(UsuarioService);
  servicioModal = inject(NgbModal);
  personalServices = inject(PersonalService);
  router = inject(Router)


  listadoDocentes: any[] = [];
  parametrosFiltros: any = {
    sort: "primernombre,desc",
    size: 10,
    page: 0
  }

  infoDocenteLogueado:any = {}

  totalHorasAsignadasDocente: number = 35;
  numero_identificacion: boolean = true;
  cargandoDocentes: boolean = false;
  datos_usuario: AccesoPerfil;
  infoMensaje: any = {};
  otrosBotones: boolean;
  horasTotales: number = 0;
  enInfoFuncionarioSeleccionado: boolean = false;
  accesoSeleccionado: any;
  identficacionUsuario: any;
  datosCargados: boolean = false;

  ngOnInit(): void {
    this.datos_usuario = this.usuarioService.obtenerAccesoSeleccionado();
    this.accesoSeleccionado = this.usuarioService.obtenerAccesoSeleccionado()
    this.identficacionUsuario = this.usuarioService.obtenerUsuario().id;
    // console.log(this.datos_usuario  ,     this.accesoSeleccionado )
    this.obtenerDocentes();   
  }

  obtenerDatos(){
    let parametos = {
      identificacion: this.identficacionUsuario,
      institucion: this.datos_usuario.colegio.id,
      sede: this.datos_usuario.sede.id,
      jornada: this.datos_usuario.jornada.id,
    }

    this.personalServices.obtenerDatosSimple(parametos).subscribe({
      next: (respuesta:any) => {
        let datos = respuesta.data
    

        this.infoDocenteLogueado.tipo_identificacion = datos.tipoIdentificacion;
        this.infoDocenteLogueado.numero_identificacion = datos.identificacion;
        this.infoDocenteLogueado.apellidos = datos.primerApellido + ' ' + datos.segundoApellido;
        this.infoDocenteLogueado.nombres = datos.primerNombre + ' ' + datos.segundoNombre;

        // console.log(this.infoDocenteLogueado)
      },
      error: (error) => {
        // console.log(error);
      }
    })
  }

  obtenerDocentes() {
  
    
    this.parametrosFiltros.sede_id='',
    this.parametrosFiltros.jornada_id= '';
    // console.log(this.infoFuncionario)
    this.cargandoDocentes = true;
    if(this.infoFuncionario  == undefined){
      // console.log('en pantalla docente')}
      this.obtenerDatos();

      this.enInfoFuncionarioSeleccionado = true;

      this.parametrosFiltros.institucion_id = this.datos_usuario.colegio.id;
      this.parametrosFiltros.metodologia_id= ConfiguracionGeneral.metodologia;
      this.parametrosFiltros.vigencia= ConfiguracionGeneral.vigencia;
      this.parametrosFiltros.sede_id= this.datos_usuario.sede.id,
      this.parametrosFiltros.jornada_id= this.datos_usuario.jornada.id;
      this.parametrosFiltros.documento_docente= this.identficacionUsuario
      
    }else{
      this.enInfoFuncionarioSeleccionado = false;
      // console.log('en pantalla rector')
      this.otrosBotones = true;

      console.log(this.infoFuncionario)

      this.parametrosFiltros = {}
      this.parametrosFiltros.institucion_id = this.infoFuncionario.funcionario.institucion;
      this.parametrosFiltros.metodologia_id= this.infoFuncionario.metodologia;
      this.parametrosFiltros.vigencia= this.infoFuncionario.vigencia;
      this.parametrosFiltros.sede_id= this.infoFuncionario.funcionario.sede,
      this.parametrosFiltros.jornada_id= this.infoFuncionario.funcionario.jornada;
      this.parametrosFiltros.documento_docente= this.infoFuncionario.funcionario.identificacion;
    }

    

    this.asignacionAcademicaService.obtenerintensidadHoraria(this.parametrosFiltros).subscribe(async (resp: any) => {


      // institucion_id, sede_id, jornada_id, 

      if (resp.status == '200') {
        this.datosCargados = true;
        let docentes:any[] = resp.data;

        docentes.forEach((docente)=>{
          // this.listadoDocentes = []
          console.log(Number(docente.horasAsignadas))
          if(Number(docente.horasAsignadas) > 0){
            this.listadoDocentes.push(docente)
            console.log(docente)
          }
        })
        // console.log(this.listadoDocentes)
        this.listadoDocentes.forEach((docente:any)=>{
          this.horasTotales += Number(docente.horasAsignadas);
        })
        this.cargandoDocentes = false;
      } else{
        
        this.datosCargados = false;
        this.listadoDocentes = [];
        this.cargandoDocentes = false;
        this.infoMensaje.titulo = '';
        this.infoMensaje.mensaje = resp.message;
        this.infoMensaje.botonesAsignacionErrorEliminar = true;
        this.infoMensaje.botonesAsignacionEliminar = false;
        this.infoMensaje.ventanaEnviado = true;
        const modalRef = this.servicioModal.open(MensajeModal, { size: 'md', centered: true, backdrop: 'static' });
        modalRef.componentInstance.infoMensaje = this.infoMensaje;
        this.router.navigate(['./home/hojas-de-vida/personal'])
      }
    })



  }

  cerrarModal(){
    this.servicioModal.dismissAll()
  }

}
