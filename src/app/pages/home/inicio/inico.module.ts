import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerRoutingModule } from './inico-routing.module';
import { InicioComponent } from './inico.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AccesosDirectosComponent } from './accesos-directos/accesos-directos.component';
import { ListaEstudiantesComponent } from './lista-estudiantes/lista-estudiantes.component';
import { ListaColegiosComponent } from './lista-colegios/lista-colegios.component';

@NgModule({
  declarations: [
    InicioComponent,
    AccesosDirectosComponent,
    ListaEstudiantesComponent,
    ListaColegiosComponent
  ],
  imports: [
    CommonModule,
    VerRoutingModule,
    ComponentsModule
  ]
})
export class InicioModule { }
