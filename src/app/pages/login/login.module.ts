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
import { BitacoraModule } from '../bitacora/bitacora.module';




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
    NgSelectModule,
    BitacoraModule
  ]
})
export class LoginModule { }
