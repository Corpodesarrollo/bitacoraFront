import { Injectable } from '@angular/core';
import { AbstractControl, ControlConfig, Form, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  validarCantidadHoraria(control: FormControl):{[s:string]: boolean | null}{    
    let valor = control.value;    
    if(!(valor>0 && valor<100)){
      return {
        error_cantidad_horaria: true
      }
    }
    return {};
  }
  
}
