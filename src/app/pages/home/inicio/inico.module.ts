import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerRoutingModule } from './inico-routing.module';
import { InicioComponent } from './inico.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    VerRoutingModule,
    ComponentsModule
  ]
})
export class InicioModule { }
