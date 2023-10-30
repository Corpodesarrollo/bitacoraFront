import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviarMensajesComponent } from './enviar-mensajes/enviar-mensajes.component';
import { NuevoMensajeComponent } from './enviar-mensajes/components/nuevo-mensaje/nuevo-mensaje.component';
import { CanActivatePermisosGuard } from 'src/app/guards/permisos/permisos.guard';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { BitacoraComponent } from './bitacora/bitacora.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'enviar-mensajes',
        component: EnviarMensajesComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.ENVIAR_MENSAJES }
      },
      {
        path: 'consulta-bitacoras',
        component: BitacoraComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.ENVIAR_MENSAJES }
      },
      {
        path: 'mensajes/editar/:id',
        component: NuevoMensajeComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
