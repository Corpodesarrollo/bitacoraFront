import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BitacoraRoutingModule } from './bitacora-routing.module';
import { BitacoraComponent } from './bitacora.component';
import { FiltrosConsultaComponent } from './components/filtros-consulta/filtros-consulta.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComponentsModule } from 'src/app/components/components.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BitacoraComponent, FiltrosConsultaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BitacoraRoutingModule,
    NgSelectModule,
    NgbDatepickerModule,
    ComponentsModule,
  ],
  exports: [BitacoraComponent],
})
export class BitacoraModule {}
