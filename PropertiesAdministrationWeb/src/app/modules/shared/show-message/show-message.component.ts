import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html'
})

export class ShowMessageComponent {
  @Input() message: string = '';
  @Input() type: string = 'info';  

  closeAlert() {
    this.message = '';
  }
}