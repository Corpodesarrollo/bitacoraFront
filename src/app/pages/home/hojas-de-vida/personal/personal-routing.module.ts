import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalComponent } from './personal.component';
import { DatosFuncionariosComponent } from './datos-funcionarios/datos-funcionarios.component';
import { EditarDatosComponent } from './editar-datos/editar-datos.component';
import { AsignacionAcademicaComponent } from './asignacion-academica/asignacion-academica.component';


const routes: Routes = [
  {
    path:'',
    component: PersonalComponent,
    children:[
      {
        path: '',
        component: DatosFuncionariosComponent,
      },
      {
        path: 'asignacion-academica',
        component: AsignacionAcademicaComponent
      },
      {
        path: 'editar-datos',
        component: EditarDatosComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
