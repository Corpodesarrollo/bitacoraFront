import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removerNulos'
})
export class RemoverNulosPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    return value.split(' ').filter(word => word.toLowerCase() !== 'null').join(' ');
  }

}
