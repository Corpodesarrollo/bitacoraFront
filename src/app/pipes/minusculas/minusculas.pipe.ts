import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minusculas'
})
export class MinusculasPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    return value.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }
}
