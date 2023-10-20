import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inico.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: InicioComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerRoutingModule { }
