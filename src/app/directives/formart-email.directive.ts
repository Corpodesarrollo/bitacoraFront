import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormartEmail]'
})
export class FormartEmailDirective {

  constructor(
    private control: NgControl,
    private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const inputElement = this.el.nativeElement;

    // Guarda la posición actual del cursor
    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;

    const value = this.control.value;
    const email = value.trim().replace(/\s/g, '').toLowerCase();

    // Establece el nuevo valor en el control
    this.control.control?.setValue(email, { emitEvent: false });

    // Restaura la posición del cursor después del cambio de valor
    inputElement.setSelectionRange(start, end);
  }
}
