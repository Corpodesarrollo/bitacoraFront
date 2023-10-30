import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualesSistemaRoutingModule } from './manuales-sistema-routing.module';
import { VerComponent } from './ver/ver.component';
import { SubirComponent } from './subir/subir.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VerComponent,
    SubirComponent,
  ],
  imports: [
    CommonModule,
    ManualesSistemaRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ManualesSistemaModule { }
