import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { NoAutorizadoComponent } from 'src/app/components/no-autorizado/no-autorizado.component';
import { AsignacionDocenteComponent } from 'src/app/components/asignacion-docente/asignacion-docente.component';
import { VerComponent } from './ver/ver.component';

const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
      children: [
        {
          path: '',
          loadChildren: () => import('./inicio/inico.module'  ).then(m => m.InicioModule),
        },
        {
          path:'ver/:ruta',
          component: VerComponent
        },
        {
          path: 'mensajes',
          loadChildren: () => import('./mensajes/mensajes.module').then(m => m.MensajesModule)
        },
        {
          path:'gestion-administrativa',
          loadChildren:() => import('./gestion-administrativa/gestion-administrativa.module').then(m => m.GestionAdministrativaModule)
        },
        {
          path:'cambiar-contrasenia',
          loadChildren:() => import('./cambiar-contrasenia/cambiar-contrasenia.module').then(m => m.CambiarContraseniaModule)
        },
        {
          path: 'manuales-sistema',
          loadChildren: () => import('./manuales-sistema/manuales-sistema.module').then(m => m.ManualesSistemaModule)
        },
        {
          path: 'hojas-de-vida',
          loadChildren: () => import('./hojas-de-vida/hojas-de-vida.module').then(m => m.HojasDeVidaModule),
        },
        {
          path: 'politicas-datos-uso',
          loadChildren: () => import('./politicas-datos-uso/politicas-datos-uso.module').then(m => m.PoliticasDatosUsoModule),
        },
        {
          path:'no-autorizado',
          component: NoAutorizadoComponent
        },
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
export class HomeRoutingModule { }
