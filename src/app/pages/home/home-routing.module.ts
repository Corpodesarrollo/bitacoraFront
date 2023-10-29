import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

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
          path: 'bitacoras',
          loadChildren: () => import('../bitacora/bitacora.module').then(m => m.BitacoraModule),
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
