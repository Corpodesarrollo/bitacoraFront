import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { PermisosUsuarios } from 'src/app/enums/usuario-permisos';
import { UsuarioService } from 'src/app/services/api/usuario/usuario.service';
import { CustomCalendarI18nService, I18n } from 'src/app/services/generales/utils/custom-calendar-i18n.service';

@Component({
  selector: 'app-enviar-mensaje',
  templateUrl: './enviar-mensajes.component.html',
  styleUrls: ['./enviar-mensajes.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomCalendarI18nService }]
})
export class EnviarMensajesComponent {

  tabActivo = 1;
  puedeEnviarMensajes: boolean = false;

  constructor(private router: Router,
    private serviciosUsuario:UsuarioService) {
    const snapshotObj: RouterStateSnapshot = router.routerState.snapshot;
    if(snapshotObj.root.queryParams['nuevo']){
      this.tabActivo=2
    }
    
    this.puedeEnviarMensajes = this.serviciosUsuario.obtetenerPermisosPerfil(PermisosUsuarios.ENVIAR_MENSAJES)

  }

  tab(tab:any){
    this.tabActivo = tab;
  }

}
