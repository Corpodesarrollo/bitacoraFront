import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { GestionAdministrativaModule } from '../home/gestion-administrativa/gestion-administrativa.module';
import { BitacoraRoutingModule } from './bitacora-routing.module';
import { BitacoraComponent } from './bitacora.component';
import { FiltrosConsultaComponent } from './components/filtros-consulta/filtros-consulta.component';
import { BitacoraService } from './services/bitacora/bitacora.service';


@NgModule({
  declarations: [
    BitacoraComponent,
    FiltrosConsultaComponent,
  ],
  imports: [
    CommonModule,
    BitacoraRoutingModule,
    ComponentsModule,
    GestionAdministrativaModule
  ],
  exports: [
    BitacoraComponent
  ],
  providers:[
    BitacoraService
  ]
})
export class BitacoraModule { }
