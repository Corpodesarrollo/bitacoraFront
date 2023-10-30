import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionDocenteComponent } from 'src/app/components/asignacion-docente/asignacion-docente.component';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { CanActivatePermisosGuard } from 'src/app/guards/permisos/permisos.guard';

const routes: Routes = [
  {
    path: 'personal',
    loadChildren: () => import('./personal/personal.module').then(m => m.PersonalModule),
    canActivate: [CanActivatePermisosGuard],
    data: { permisos: PermisosUsuarios.PERSONAL}
  },
  {
    path:'personal/asignacion-docente',
    component:AsignacionDocenteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HojasDeVidaRoutingModule { }
