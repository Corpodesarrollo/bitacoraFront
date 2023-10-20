import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './gestion-administrativa-routing.module';
import { EnviarMensajesComponent } from './enviar-mensajes/enviar-mensajes.component';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscarComponent } from './enviar-mensajes/components/buscar/buscar.component';
import { NuevoMensajeComponent } from './enviar-mensajes/components/nuevo-mensaje/nuevo-mensaje.component';
import { CustomDateParserFormatter, FiltrosComponent } from './enviar-mensajes/components/filtros/filtros.component';
import { RouterModule } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MensajeModal } from './enviar-mensajes/components/mensaje-modal/mensaje-modal';





@NgModule({
  declarations: [
    EnviarMensajesComponent,
    BuscarComponent,
    BuscarComponent,
    NuevoMensajeComponent,
    FiltrosComponent,
    MensajeModal
  ],
  imports: [
    NgbDatepickerModule,
    CommonModule,
    AdminRoutingModule,
    NgbNavModule,
    NgSelectModule,
    NgbPaginationModule, 
    NgbAlertModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule,
    AngularEditorModule
    ],
    providers: [
      // { provide: NgbDateAdapter, useClass: CustomAdapter },
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    ],
})
export class GestionAdministrativaModule { }
