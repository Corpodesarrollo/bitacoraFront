import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarContraseniaComponentLogin } from './cambiar-contrasenia.component';

const routes: Routes = [
  {
    path: '',
    component: CambiarContraseniaComponentLogin,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambiarContraseniaRoutingModule { }
