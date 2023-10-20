import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomCalendarI18nService, I18n } from 'src/app/services/generales/utils/custom-calendar-i18n.service';

@Component({
  selector: 'app-enviar-mensaje',
  templateUrl: './enviar-mensajes.component.html',
  styleUrls: ['./enviar-mensajes.component.scss'],
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomCalendarI18nService }]
})
export class EnviarMensajesComponent {

  tabActivo = 1;

  constructor(private router: Router) {
    const snapshotObj: RouterStateSnapshot = router.routerState.snapshot;
    if(snapshotObj.root.queryParams['nuevo']){
      this.tabActivo=2
    }
  }

  tab(tab:any){
    this.tabActivo = tab;
  }

}
