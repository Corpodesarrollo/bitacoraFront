import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MensajesRoutingModule } from './mensajes-routing.module';
import { MensajesComponent } from './mensajes.component';
import { VerComponent } from './ver/ver.component';
import { AgregarComponent } from './agregar/agregar.component';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    MensajesComponent,
    VerComponent,
    AgregarComponent
  ],
  imports: [
    CommonModule,
    MensajesRoutingModule,
    HttpClientModule,
    ComponentsModule
  ]
})
export class MensajesModule { }
