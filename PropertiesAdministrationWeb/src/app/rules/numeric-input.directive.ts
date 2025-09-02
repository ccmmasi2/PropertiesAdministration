import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumericInput]'
})
export class NumericInputDirective {

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    event.stopPropagation(); 
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9]/g, '');

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    input.value = value;
  }
}
