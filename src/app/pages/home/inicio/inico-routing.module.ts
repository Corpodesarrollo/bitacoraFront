import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inico.component';
import { ListaEstudiantesComponent } from './lista-estudiantes/lista-estudiantes.component';
import { ListaColegiosComponent } from './lista-colegios/lista-colegios.component';
import { AccesosDirectosComponent } from './accesos-directos/accesos-directos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: InicioComponent
      },
      {
        path:'listar-estudiantes',
        component: ListaEstudiantesComponent
      },
      {
        path:'listar-colegios',
        component: ListaColegiosComponent
      },
      {
        path:'accesos-directos',
        component: AccesosDirectosComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerRoutingModule { }
