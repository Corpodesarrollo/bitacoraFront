import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales'
})
export class InicialesPipe implements PipeTransform {

  transform(value: string): string {
    const words = value.split(' ');
    const firstTwoWords = words.slice(0, 2);
    const initials = firstTwoWords.map(word => word.charAt(0).toUpperCase());
    return initials.join('');
  }

}
