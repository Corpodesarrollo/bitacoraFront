import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BitacoraRoutingModule } from './bitacora-routing.module';
import { BitacoraComponent } from './bitacora.component';


@NgModule({
  declarations: [
    BitacoraComponent
  ],
  imports: [
    CommonModule,
    BitacoraRoutingModule
  ]
})
export class BitacoraModule { }
