import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'personal',
    loadChildren: () => import('./personal/personal.module').then(m => m.PersonalModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HojasDeVidaRoutingModule { }
