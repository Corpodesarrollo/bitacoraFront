import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnaTabla } from 'src/app/classes/columna_tabla.interface';
import { DatosBitacora } from 'src/app/classes/datos_bitacora.interface';
import { BitacoraService } from './services/bitacora/bitacora.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { JornadaService } from 'src/app/services/api/jornada/jornada.service';
import { ColegioService } from 'src/app/services/api/colegio/colegio.service';
import { SedeService } from 'src/app/services/api/sede/sede.service';
import { UsuarioFiltrosService } from 'src/app/services/api/usuario-filtros/usuario-filtros.service';
import { TipoLogService } from 'src/app/services/api/tipoLog/tipo-log.service';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { AccesoPerfil } from 'src/app/interfaces/acceso_perfil.interface';
import { Perfiles } from 'src/app/enums/perfiles.enum';
import { DatosFiltrados } from 'src/app/classes/datos_filtrados.interface';
import { ConsultasService } from 'src/app/services/api/consultas/consultas.service';
import * as moment from 'moment';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss'],
})
export class BitacoraComponent implements OnInit {
  public minDate: NgbDate;
  public maxDate: NgbDate;
  public mostrarFiltrosAvanzados: boolean = false;

  public filtrosFormGroup: FormGroup;
  cargandoInformacion:boolean = false;

  public listaUsuarios: any[];
  public listaColegios: any[];
  public listaSedes: any[];
  public listaJornadas: any[];
  public listaTiposLog: any[];
  public listaModulos: any[];
  public listaSubModulos: any[];

  public nPag:number = 0;
  public itemXpag:number = 5;
  public totalPag:number = 1;
  public totalReg:number = 0;

  public columnasTablaBitacora: ColumnaTabla[] = [
    { titulo: 'Fecha-Hora', campo: 'fechaRegistro' },
    { titulo: 'Usuario-Perfil', campo: 'usuario' },
    { titulo: 'Módulo-Submódulo', campo: 'submodulo' },
    { titulo: 'Tipo de Log', campo: 'tipoLog' },
  ];

  datosBitacora: DatosBitacora[] = [];

  public informacionUsuario: AccesoPerfil;
  public idUsuario: string;
  public buscador: string = null;
  public invalidFechaIni: boolean = false;
  public invalidFechaFin: boolean = false;
  public ordenar: string = 'ASC'

  public constructor(
    private consultasService: ConsultasService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private usuarioFiltrosService: UsuarioFiltrosService,
    private colegioService: ColegioService,
    private sedeService: SedeService,
    private jornadaService: JornadaService,
    private tipoLogService: TipoLogService
  ) {
    this.filtrosFormGroup = this.formBuilder.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      usuario: [null, [Validators.required]],
      colegio: [{value: null, disabled: false}, [Validators.required]],
      sede: [null, [Validators.required]],
      jornada: [null, [Validators.required]],
      tipoLogBitacora: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.idUsuario = this.usuarioService.obtenerUsuario()?.id;
    this.informacionUsuario = this.usuarioService.obtenerUsuarioPerCol();
    this.getColegios(this.idUsuario, true);
    this.initFiltros();
    this.filtrosFormGroup.get('fechaInicio').valueChanges.subscribe((value) => {
      this.invalidFechaIni = false;
      this.consultarBitacora(0);
      //this.minDate = new NgbDate(value.year, value.month, value.day);
    });
    this.filtrosFormGroup.get('fechaFin').valueChanges.subscribe((value) => {
      this.invalidFechaFin = false;
      this.consultarBitacora(0);
      //this.maxDate = new NgbDate(value.year, value.month, value.day);
    });
    if (this.informacionUsuario.perfil.id !== Perfiles.ADMINISTRADOR) { // Valida si es administrador
      this.usuarioService.obtenerMenu({perfil_id:0,institucion_id:this.informacionUsuario.colegio.id}).subscribe((respuesta: any) => {
        this.listaModulos = respuesta?.data?.menuServiceCatalog;
        this.listaSubModulos = respuesta?.data?.subMenuGeneralPrivate;
    });
    }
  }

  private initFiltros(): void {
    let institucion = null;
    if (this.informacionUsuario.perfil.id !== Perfiles.ADMINISTRADOR) { // Valida si es administrador
      institucion = this.informacionUsuario.colegio.id;
    }
    let bodyUsuarios = {
      nivelPerfil: this.informacionUsuario.perfil.idPerfilNivel,
      perfil: this.informacionUsuario.perfil.id,
      institucion: institucion
    }
    if (this.informacionUsuario.perfil.id !== Perfiles.ADMINISTRADOR) {
      this.usuarioFiltrosService.obtenerUsarios(bodyUsuarios).subscribe((response: any) => {
        this.listaUsuarios = response?.data as [];
      });
    }

    this.tipoLogService.obtenerTiposLog().subscribe((response: any) => {
      this.listaTiposLog = response?.data;
    });
  }

  public getColegios(idUsuario: string, disableInput: boolean = false) {
    let bodyColegios = {
      usuario: idUsuario
    }
    this.colegioService.obtenerColegios(bodyColegios).subscribe((response: any) => {
      this.listaColegios = response?.data;
      if (disableInput && this.informacionUsuario.perfil.id !== Perfiles.ADMINISTRADOR) {
        this.filtrosFormGroup.controls['colegio'].setValue({codigo: this.informacionUsuario.colegio.id, nombre: this.informacionUsuario.colegio.nombre});
        this.filtrosFormGroup.get('colegio').disable();
        this.getSedes(this.informacionUsuario.colegio.id)
      }
      if (this.informacionUsuario.perfil.id == Perfiles.ADMINISTRADOR) {
        this.listaSedes = [];
        this.listaJornadas = [];
        this.filtrosFormGroup.get('sede').reset();
      }
    });
  }

  public getSedes(idColegio) {
    let bodySedes = {
      colegio: idColegio
    }
    this.sedeService.obtenerSedes(bodySedes).subscribe((response: any) => {
      this.listaSedes = response?.data;
      this.listaJornadas = [];
      this.filtrosFormGroup.get('jornada').reset();
    });
    if (this.informacionUsuario.perfil.id == Perfiles.ADMINISTRADOR) {
      let bodyUsuarios = {
        nivelPerfil: 6,
        perfil: this.informacionUsuario.perfil.id,
        institucion: idColegio
      }
      this.usuarioFiltrosService.obtenerUsarios(bodyUsuarios).subscribe((response: any) => {
        this.listaUsuarios = response?.data as [];
      });
    }

  }

  public getJornadas(idSede) {
    let bodyJornadas = {
      sede: idSede
    }
    this.jornadaService.obtenerJornadas(bodyJornadas).subscribe((response: any) => {
      this.listaJornadas = response?.data;
    });

  }

  public buscarEnTabla(buscar: string){
    this.buscador = buscar;
    this.consultarBitacora(0);
  }

  public ordenarDatos(){
    if (this.ordenar == 'ASC') {
      this.ordenar = 'DESC';
    } else{
      this.ordenar = 'ASC';
    }
    this.consultarBitacora(0);
  }

  public consultarBitacora(nPag?:number): void {
    this.nPag = nPag;
    let datos:any = this.filtrosFormGroup.getRawValue();
    if(datos.fechaInicio && datos.fechaFin) {
      datos.fechaInicio = new Date(datos.fechaInicio.year,datos.fechaInicio.month-1,datos.fechaInicio.day,0,0,0);
      datos.fechaFin = new Date(datos.fechaFin.year,datos.fechaFin.month-1,datos.fechaFin.day,23,59,59);
      datos.colegio = datos?.colegio?.codigo;
      let filtros:DatosFiltrados = datos;
      filtros.paginaActual = nPag;
      filtros.itemsPagina = this.itemXpag;
      filtros.descripcion = this.buscador;
      filtros.ordenar = this.ordenar;
      this.consultasService.consultaBitacoras(filtros).subscribe((resultado:any) => {
        this.datosBitacora = resultado.data as DatosBitacora[];
        if(this.datosBitacora.length > 0) {
          this.totalPag = Math.ceil(this.datosBitacora[0].totalPag/this.itemXpag);
          this.totalReg = this.datosBitacora[0].totalPag;
        }
        this.datosBitacora.map((registro:DatosBitacora) => {
          registro.fechaRegistro = moment(registro.fechaRegistro).format('DD/MM/YYYY h:mm a');
          registro.usuario = this.listaUsuarios?.find(usuario => usuario.codigo === registro.usuario)?.nombre;
          registro.usuario = registro.usuario + ' - ' + registro.nomPerfil;
          registro.modulo = this.listaModulos?.find(modulo => Number(modulo.serCatCodigo) === registro.modulo)?.catNombre;
          registro.submodulo = this.listaSubModulos?.find(submodulo => Number(submodulo.serCodigo) === registro.submodulo)?.serNombre;
          if(registro.modulo && registro.submodulo)
            registro.submodulo = registro.modulo + ' - ' + registro.submodulo;
          else
            registro.submodulo = "";
          registro.tipoLog = this.listaTiposLog?.find(tipo => tipo.id === registro.tipoLog)?.nombre;
          registro.detalle = decodeURIComponent(registro.detalle);
        })
      });
    } else{
      if (!datos.fechaInicio) {
        this.invalidFechaIni = true;
      }
      if (!datos.fechaFin) {
        this.invalidFechaFin = true;
      }
    }
  }

  exportar(datos: any): void {
    this.cargandoInformacion = true;
    if (datos?.tipo == 'pdf') {
      this.consultasService.exportarBitacoraPDF(datos?.fila?.id).subscribe((resultado:any) => {
        console.log(resultado);
        if(resultado?.data)
          this.downloadFile(resultado?.data, "application/pdf", "Bitacora.pdf");
      });
    } else {
      this.consultasService.exportarBitacoraExcel(datos?.fila?.id).subscribe((resultado:any) => {
        if(resultado?.data)
          this.downloadFile(resultado?.data, "application/vnd.ms-excel", "Bitacora.xls");
      });
    }
    console.log(datos);
  }
  downloadFile(base64:string, mimetype:string, fileName:string) {
    const linkSource = `data:${mimetype};base64,${base64}`;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
    this.cargandoInformacion = false;
  }

}
