import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviarMensajesComponent } from './enviar-mensajes/enviar-mensajes.component';
import { NuevoMensajeComponent } from './enviar-mensajes/components/nuevo-mensaje/nuevo-mensaje.component';

const routes: Routes = [
  {
    path:'',
    children:[
      {
        path:'enviar-mensajes',
        component:EnviarMensajesComponent
      },
      {
        path:'mensajes/editar/:id',
        component:NuevoMensajeComponent
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }