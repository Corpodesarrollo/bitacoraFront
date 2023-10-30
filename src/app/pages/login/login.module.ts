import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { RecuperarContraseniaComponent } from './recuperar-contrasenia/recuperar-contrasenia.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { SeleccionarPerfilComponent } from './seleccionar-perfil/seleccionar-perfil.component';
import { LoginComponent } from './login.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MayusculasPipe } from 'src/app/pipes/mayusculas/mayusculas.pipe';
import { ErrorInicioComponent } from './error-inicio/error-inicio.component';
import { IngresarComponent } from './ingresar/ingresar.component';
import { ConsultasComponent } from './consultas/consultas.component';
import { CapitalizarPipe } from 'src/app/pipes/capitalizar/capitalizar.pipe';
import { CambiarContraseniaComponentLogin } from './cambiar-contrasenia/cambiar-contrasenia.component';
import { PoliticaDatosComponent } from './politica-datos/politica-datos.component';
import { SinPerfilComponent } from './seleccionar-perfil/components/sin-perfil/sin-perfil.component';
import { BienvenidaComponent } from './seleccionar-perfil/components/bienvenida/bienvenida.component';
import { VistaInstitucionComponent } from './seleccionar-perfil/components/vista-institucion/vista-institucion.component';
import { VistaInstSedeJornadaComponent } from './seleccionar-perfil/components/vista-inst-sede-jornada/vista-inst-sede-jornada.component';
import { VistaNoInstitucionComponent } from './seleccionar-perfil/components/vista-no-institucion/vista-no-institucion.component';
import { ModalVerPoliticaComponent } from './politica-datos/modal-ver-politica/modal-ver-politica.component';

@NgModule({
  declarations: [
    RecuperarContraseniaComponent,
    SeleccionarPerfilComponent,
    LoginComponent,
    IngresarComponent,
    MayusculasPipe,
    ErrorInicioComponent,
    ConsultasComponent,
    CapitalizarPipe,
    CambiarContraseniaComponentLogin,
    PoliticaDatosComponent,
    SinPerfilComponent,
    VistaInstitucionComponent,
    BienvenidaComponent,
    VistaInstSedeJornadaComponent,
    VistaNoInstitucionComponent,
    ModalVerPoliticaComponent,
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    ComponentsModule,
    LoginRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule
  ]
})
export class LoginModule { }
