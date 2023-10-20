import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerComponent } from './ver/ver.component';
import { SubirComponent } from './subir/subir.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: VerComponent
      },
      {
        path:'subir-manual',
        component: SubirComponent
      }
    ]
  },
  {
    path:'**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManualesSistemaRoutingModule { }
