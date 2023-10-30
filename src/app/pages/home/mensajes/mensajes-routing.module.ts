import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MensajesComponent } from './mensajes.component';
import { VerComponent } from './ver/ver.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MensajesComponent
      },
      {
        path:'ver/:id',
        component: VerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensajesRoutingModule { }
