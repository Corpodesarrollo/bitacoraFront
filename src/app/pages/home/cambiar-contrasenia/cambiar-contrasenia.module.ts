import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { CambiarContraseniaRoutingModule } from './cambiar-contrasenia-routing.module';
import { CambiarContrasenaComponent } from './cambiar-contrasena.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    CambiarContrasenaComponent,

  ],
  imports: [
    CommonModule,
    CambiarContraseniaRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ]
})
export class CambiarContraseniaModule { }
