import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeleccionarPerfilComponent } from './seleccionar-perfil/seleccionar-perfil.component';
import { CambiarContraseniaComponentLogin } from './cambiar-contrasenia/cambiar-contrasenia.component';
import {  IngresarComponent } from './ingresar/ingresar.component';
import { LoginComponent } from './login.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { VerPoliticasComponent } from '../home/politicas-datos-uso/ver-politicas/ver-politicas.component';
import { PaginadorComponent } from 'src/app/components/paginador/paginador.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: '',
        component: IngresarComponent
      },
      {
        path: 'seleccionar-perfil',
        component: SeleccionarPerfilComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'cambiar-contrasenia',
        component: CambiarContraseniaComponentLogin,
        canActivate: []
      },
      {
        path: 'consultas',
        loadChildren: () => import('./consultas/consultas.module').then(m => m.ConsultasModule)
      },
      {
        path: 'visualizar-politicas/:id',
        component: VerPoliticasComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
