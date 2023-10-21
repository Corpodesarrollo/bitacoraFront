import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BitacoraRoutingModule } from './bitacora-routing.module';
import { BitacoraComponent } from './bitacora.component';
import { FiltrosConsultaComponent } from './components/filtros-consulta/filtros-consulta.component';


@NgModule({
  declarations: [
    BitacoraComponent,
    FiltrosConsultaComponent
  ],
  imports: [
    CommonModule,
    BitacoraRoutingModule
  ],
  exports: [
    BitacoraComponent
  ]
})
export class BitacoraModule { }
