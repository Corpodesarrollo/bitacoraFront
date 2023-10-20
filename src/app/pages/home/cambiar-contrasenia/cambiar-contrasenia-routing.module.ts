import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarContrasenaComponent } from './cambiar-contrasena.component';

const routes: Routes = [
  {
    path: '',
    component: CambiarContrasenaComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambiarContraseniaRoutingModule { }
