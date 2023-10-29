import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicadoresComponent } from './indicadores.component';
import { IndicadoresService } from './services/indicadores/indicadores.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    IndicadoresComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbDatepickerModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  providers: [
    IndicadoresService
  ]
})
export class IndicadoresModule { }
