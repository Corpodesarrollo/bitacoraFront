import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.scss']
})
export class VerComponent {

  versionId:number
  constructor(
    private activatedRoute: ActivatedRoute,
  ){
    this.activatedRoute.params.subscribe((params:any) => {
      console.log(params);
      if(params.id){
        this.versionId = params.id;
        this.cargarVersion(params.id);
      }
    });
  }
  cargarVersion(version_id:number){


  }
}
