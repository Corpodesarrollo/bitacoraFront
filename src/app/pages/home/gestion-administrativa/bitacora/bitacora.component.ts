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

  public listaUsuarios: any;
  public listaColegios: any;
  public listaSedes: any;
  public listaJornadas: any;
  public listaTiposLog: any;

  public columnasTablaBitacora: ColumnaTabla[] = [
    { titulo: 'Fecha-Hora', campo: 'fecha' },
    { titulo: 'Usuario-Perfil', campo: 'usuario' },
    { titulo: 'Modulo-submodulo', campo: 'modulo' },
    { titulo: 'Tipo de Log', campo: 'tipoLog' },
  ];

  datosBitacora: DatosBitacora[] = [];

  public constructor(
    private bitacoraService: BitacoraService,
    private formBuilder: FormBuilder,
    private usuarioFiltrosService: UsuarioFiltrosService,
    private colegioService: ColegioService,
    private sedeService: SedeService,
    private jornadaService: JornadaService,
    private tipoLogService: TipoLogService
  ) {
    this.filtrosFormGroup = this.formBuilder.group({
      fechaDesde: ['', [Validators.required]],
      fechaHasta: ['', [Validators.required]],
      usuario: [null, [Validators.required]],
      colegio: [null, [Validators.required]],
      sede: [null, [Validators.required]],
      jornada: [null, [Validators.required]],
      tipoLog: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initFiltros();
    this.consultarBitacora();
    this.filtrosFormGroup.get('fechaDesde').valueChanges.subscribe((value) => {
      this.minDate = new NgbDate(value.year, value.month, value.day);
    });
    this.filtrosFormGroup.get('fechaHasta').valueChanges.subscribe((value) => {
      this.maxDate = new NgbDate(value.year, value.month, value.day);
    });

  }

  private initFiltros(): void {
    let bodyUsuarios = {
      "nivelPerfil": 1,
      "perfil": 110,
      "institucion": 0
    }
    this.usuarioFiltrosService.obtenerUsarios(bodyUsuarios).subscribe((response: any) => {
      this.listaUsuarios = response?.data;
      this.listaColegios = [];
      this.listaSedes = [];
      this.listaJornadas = [];
      this.filtrosFormGroup.get('colegio').reset();
    });

    this.tipoLogService.obtenerTiposLog().subscribe((response: any) => {
      this.listaTiposLog = response?.data;
    });
  }

  public getColegios(idUsuario: string) {
    let bodyColegios = {
      usuario: idUsuario
    }
    this.colegioService.obtenerColegios(bodyColegios).subscribe((response: any) => {
      this.listaColegios = response?.data;
      this.listaSedes = [];
      this.listaJornadas = [];
      this.filtrosFormGroup.get('sede').reset();
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

  }

  public getJornadas(idSede) {
    let bodyJornadas = {
      sede: idSede
    }
    this.jornadaService.obtenerJornadas(bodyJornadas).subscribe((response: any) => {
      this.listaJornadas = response?.data;
    });

  }

  private consultarBitacora(): void {
    this.datosBitacora = this.bitacoraService.consultaBitacoras();
  }

  exportar(datos: any): void {
    if (datos?.fila == undefined) {
      //consumo exportar todo
    } else {
      //consumo exportar individual
    }
    console.log(datos);
  }
}
