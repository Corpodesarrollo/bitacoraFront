import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliticasDatosUsoRoutingModule } from './politicas-datos-uso-routing.module';
import { PoliticasUsoComponent } from './politicas-uso/politicas-uso.component';
import { AgregarComponent } from './politicas-uso/agregar/agregar.component';
import { PoliticasDatosUsoComponent } from './politicas-datos-uso.component';
import { ComponentsModule } from 'src/app/components/components.module';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListarComponent } from './listar/listar.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { VerPoliticasComponent } from './ver-politicas/ver-politicas.component';



@NgModule({
  declarations: [
    PoliticasUsoComponent,
    AgregarComponent,
    PoliticasDatosUsoComponent,
    ListarComponent,
    VerPoliticasComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    PoliticasDatosUsoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule
  ]
})
export class PoliticasDatosUsoModule { }
