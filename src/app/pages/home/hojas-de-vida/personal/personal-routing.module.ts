import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalComponent } from './personal.component';
import { DatosFuncionariosComponent } from './datos-funcionarios/datos-funcionarios.component';
import { EditarDatosComponent } from './editar-datos/editar-datos.component';
import { AsignacionAcademicaComponent } from './asignacion-academica/asignacion-academica.component';
import { AsignacionesFuncionarioComponent } from './asignacion-academica/components/asignaciones-funcionario/asignaciones-funcionario.component';
import { AsignacionDocenteComponent } from 'src/app/components/asignacion-docente/asignacion-docente.component';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { CanActivatePermisosGuard } from 'src/app/guards/permisos/permisos.guard';
import { EditarDatosDocenteComponent } from './editar-datos-docente/editar-datos-docente.component';
import { personalEditarGuard } from 'src/app/guards/permisos/personal/personal-editar.guard';
// import { AsignacionDocenteComponent } from '../../../../components/asignacion-docente/asignacion-docente.component';


const routes: Routes = [
  {
    path: '',
    component: PersonalComponent,
    children: [
      {
        path: '',
        component: DatosFuncionariosComponent,
        canActivate: [personalEditarGuard],
      },
      {
        path: 'asignacion-academica',
        component: AsignacionAcademicaComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.PERSONAL }
      },
      {
        path: 'editar-datos',
        component: EditarDatosComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.PERSONAL_EDITAR_ADMIN }
      },
      {
        path: 'editar-datos-funcionario',
        component: EditarDatosDocenteComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.PERSONAL_EDITAR}
      },
      {
        path: 'asignaciones-funcionario',
        component: AsignacionesFuncionarioComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.PERSONAL_ASIGNACION_ACADEMICA }
      },
      {
        path: 'asignacion-docente',
        component: AsignacionDocenteComponent,
        canActivate: [CanActivatePermisosGuard],
        data: { permisos: PermisosUsuarios.PERSONAL_ASIGNACION_ACADEMICA }
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
