import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { PoliticasDatosUsoComponent } from './politicas-datos-uso.component';
import { PoliticasUsoComponent } from './politicas-uso/politicas-uso.component';
import { VerPoliticasComponent } from 'src/app/pages/home/politicas-datos-uso/ver-politicas/ver-politicas.component';
import { CanActivatePermisosGuard } from 'src/app/guards/permisos/permisos.guard';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';

const routes: Routes = [{
  path: '',
  component: PoliticasDatosUsoComponent,
  children: [
    {
      path: '',
      component: ListarComponent,
      canActivate: [CanActivatePermisosGuard],
      data: { permisos: PermisosUsuarios.POLITICAS_DATOS_USO }
    },
    {
      path: 'cambiar-politicas-uso',
      component: PoliticasUsoComponent,
      canActivate: [CanActivatePermisosGuard],
      data: { permisos: PermisosUsuarios.POLITICAS_DATOS_USO }
    },
    {
      path: 'ver-politicas-uso/:id',
      component: VerPoliticasComponent,
      canActivate: [CanActivatePermisosGuard],
      data: { permisos: PermisosUsuarios.POLITICAS_DATOS_USO }
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
