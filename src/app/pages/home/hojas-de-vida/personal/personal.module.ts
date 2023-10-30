import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalComponent } from './personal.component';
import { FiltrosComponent } from './datos-funcionarios/filtros/filtros.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {  NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatosFuncionariosComponent } from './datos-funcionarios/datos-funcionarios.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { EditarFotoUsuarioComponent } from './editar-foto-usuario/editar-foto-usuario.component';
import { EditarDatosDocenteComponent } from './editar-datos-docente/editar-datos-docente.component';
import { EditarDatosComponent } from './editar-datos/editar-datos.component';

import { InactivarUsuarioComponent } from './inactivar-usuario/inactivar-usuario.component';
import { DesasociarFuncionarioComponent } from './desasociar-funcionario/desasociar-funcionario.component';
import { AnuarioComponent } from './anuario/anuario.component';
import { AsignacionAcademicaComponent } from './asignacion-academica/asignacion-academica.component';
import { AsignacionesFuncionarioComponent } from './asignacion-academica/components/asignaciones-funcionario/asignaciones-funcionario.component';
import { CopiarAsignacionAcademicaComponent } from './asignacion-academica/components/copiar-asignacion-academica/copiar-asignacion-academica.component';
import { MensajeDescargarReporteComponent } from './asignacion-academica/components/mensaje-descargar-reporte/mensaje-descargar-reporte.component';
import { VerAsignacionAcademicaComponent } from './asignacion-academica/components/ver-asignacion-academica/ver-asignacion-academica.component';
import { FiltrosAsignacionComponent } from './asignacion-academica/components/filtros-asignacion/filtros-asignacion.component';
import { EliminarComponent } from './editar-datos/eliminar/eliminar.component';
import { FormartEmailDirective } from 'src/app/directives/formart-email.directive';
import { CerrarComponent } from './editar-datos/cerrar/cerrar.component';
import { MensajeModal } from './asignacion-academica/components/mensaje-modal/mensaje-modal';
import { AsignacionDocenteComponent } from '../../../../components/asignacion-docente/asignacion-docente.component';




@NgModule({
  declarations: [
    PersonalComponent,
    FiltrosComponent,
    FiltrosAsignacionComponent,
    EditarDatosDocenteComponent,
    EditarFotoUsuarioComponent,
    EditarDatosComponent,
    DatosFuncionariosComponent,
    AsignacionAcademicaComponent,
    InactivarUsuarioComponent,
    DesasociarFuncionarioComponent,
    AnuarioComponent,
    MensajeModal,
    AsignacionesFuncionarioComponent,
    VerAsignacionAcademicaComponent,
    MensajeDescargarReporteComponent,
    CopiarAsignacionAcademicaComponent,
    EliminarComponent,
    FormartEmailDirective,
    CerrarComponent,
    AsignacionDocenteComponent
  ],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    NgbCollapseModule,
    ComponentsModule,
  ]
})
export class PersonalModule { }
