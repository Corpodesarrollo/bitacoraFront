import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HojasDeVidaRoutingModule } from './hojas-de-vida-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HojasDeVidaRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
  ]
})
export class HojasDeVidaModule { }
