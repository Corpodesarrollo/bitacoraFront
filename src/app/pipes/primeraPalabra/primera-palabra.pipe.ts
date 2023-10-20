import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inicial'
})
export class PrimeraPalabraPipe implements PipeTransform {

  transform(valor: string): string {
    if (!valor) return valor;
    return valor.charAt(0).toUpperCase() + valor.slice(1);
  }

}
