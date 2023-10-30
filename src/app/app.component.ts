import { Component, inject } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sesionIniciada:boolean=false;

  title = 'look-and-feel';

  config = inject(NgSelectConfig);

  ngOnInit(){
    this.config.notFoundText = 'No se han encontrado registros';
  }


}
