import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultasRoutingModule } from './consultas-routing.module';
import { ModalErroresCamposComponent } from '../../../components/modal-errores-campos/modal-errores-campos.component';


@NgModule({
  declarations: [
    ModalErroresCamposComponent
  ],
  imports: [
    CommonModule,
    ConsultasRoutingModule
  ]
})
export class ConsultasModule { }
