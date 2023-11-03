import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { GestionAdministrativaModule } from '../home/gestion-administrativa/gestion-administrativa.module';
import { BitacoraRoutingModule } from './bitacora-routing.module';
import { BitacoraComponent } from './bitacora.component';
import { BitacoraService } from './services/bitacora/bitacora.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BitacoraComponent],
  imports: [
    CommonModule,
    BitacoraRoutingModule,
    ComponentsModule,
    GestionAdministrativaModule,
    NgSelectModule,
    NgbDatepickerModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  exports: [BitacoraComponent],
  providers: [BitacoraService],
})
export class BitacoraModule {}

// BORRAR  TODOS LO PERTENECIENTE A ESTE MODULO CUANDO SE INTEGRE CON EL REPOSITORIO PRINCIPAL