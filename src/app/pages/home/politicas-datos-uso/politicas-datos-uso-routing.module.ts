import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { PoliticasDatosUsoComponent } from './politicas-datos-uso.component';
import { PoliticasUsoComponent } from './politicas-uso/politicas-uso.component';
import { VerPoliticasComponent } from 'src/app/pages/home/politicas-datos-uso/ver-politicas/ver-politicas.component';

const routes: Routes = [{
  path: '',
  component: PoliticasDatosUsoComponent,
  children: [
    {
      path: '',
      component: ListarComponent,
    },
    {
      path: 'politicas-uso',
      component: PoliticasUsoComponent,
    },
    {
      path: 'politicas-uso/:id',
      component: VerPoliticasComponent,
    },
    {
      path:'**',
      redirectTo:''
    }
  ]
},
  {
    path:'**',
    redirectTo:''
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliticasDatosUsoRoutingModule { }
