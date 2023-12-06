import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MensajesComponent } from './mensajes.component';
import { VerComponent } from './ver/ver.component';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { CanActivatePermisosGuard } from 'src/app/guards/permisos/permisos.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MensajesComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.VER_MENSAJE_MENU }
      },
      {
        path:'ver/:id',
        component: VerComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.VER_MENSAJE_MENU }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensajesRoutingModule { }
