import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizar'
})
export class CapitalizarPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const palabras = value.trim().split(' ');
    const iniciales = palabras.map(palabra => {
      const primeraLetra = palabra.charAt(0).toUpperCase();
      const resto = palabra.substr(1).toLowerCase();
      return primeraLetra + resto;
    });
    return iniciales.join(' ');
  }

}
