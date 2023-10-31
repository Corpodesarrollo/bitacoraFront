import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargandoComponent } from './cargando/cargando.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { PiePaginaComponent } from './pie-pagina/pie-pagina.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { PrimeraPalabraPipe } from '../pipes/primeraPalabra/primera-palabra.pipe';
import { MenuComponent } from './menu/menu.component';
import { InicialesPipe } from '../pipes/iniciales/iniciales.pipe';
import { MinusculasPipe } from '../pipes/minusculas/minusculas.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MensajesComponent } from './mensajes/mensajes.component';
import { MigaPanComponent } from './miga-pan/miga-pan.component';
import { PaginadorComponent } from './paginador/paginador.component';
import { ContraseniaComponent } from './contrasenia/contrasenia.component';
import { ErrorCambioComponentC } from './error-cambio/error-cambio.component';
import { ExitoCambioComponentC } from './exito-cambio/exito-cambio.component';
import { CargarFotografiaComponent } from './cargar-fotografia/cargar-fotografia.component';
import { CamaraComponent } from './camara/camara.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { WebcamModule } from 'ngx-webcam';
import { ConfirmarCerrarSesionComponent } from './confirmar-cerrar-sesion/confirmar-cerrar-sesion.component';
import { ModalInformacionComponent } from './modal-informacion/modal-informacion.component';
import { SinRegistrosComponent } from './sin-registros/sin-registros.component';
import { VerPoliticasComponent } from './ver-politicas/ver-politicas.component';
import { CarruselImagenesComponent } from './carrusel-imagenes/carrusel-imagenes.component';
import { NoAutorizadoComponent } from './no-autorizado/no-autorizado.component';
import { SesionAEComponent } from './sesion-ae/sesion-ae.component';
import { FilaDinamicaTablaComponent } from './fila-dinamica-tabla/fila-dinamica-tabla.component';
import { TablaRegistroDetalleComponent } from './tabla-registro-detalle/tabla-registro-detalle.component';

@NgModule({
  declarations: [
    CargandoComponent,
    CabeceraComponent,
    PiePaginaComponent,
    PrimeraPalabraPipe,
    InicialesPipe,
    MenuComponent,
    MensajesComponent,
    MigaPanComponent,
    PaginadorComponent,
    MinusculasPipe,
    ContraseniaComponent,
    ErrorCambioComponentC,
    ExitoCambioComponentC,
    CargarFotografiaComponent,
    CamaraComponent,
    ConfirmarCerrarSesionComponent,
    ModalInformacionComponent,
    VerPoliticasComponent,
    SinRegistrosComponent,
    CarruselImagenesComponent,
    NoAutorizadoComponent,
    SesionAEComponent,
    FilaDinamicaTablaComponent,
    TablaRegistroDetalleComponent
  ],
  exports:[
    CamaraComponent,
    CargarFotografiaComponent,
    CargandoComponent,
    CabeceraComponent,
    PiePaginaComponent,
    MigaPanComponent,
    MenuComponent,
    MensajesComponent,
    PaginadorComponent,
    ExitoCambioComponentC,
    ErrorCambioComponentC,
    ContraseniaComponent,
    ConfirmarCerrarSesionComponent,
    ModalInformacionComponent,
    VerPoliticasComponent,
    SinRegistrosComponent,
    CarruselImagenesComponent,
    NoAutorizadoComponent,
    SesionAEComponent,
    FilaDinamicaTablaComponent,
    TablaRegistroDetalleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    WebcamModule,
    AngularCropperjsModule
  ]
})
export class ComponentsModule { }
