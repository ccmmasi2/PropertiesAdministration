import { Component } from '@angular/core';
import { AlertService } from './services/alert-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {

  title = 'order web angular';
  alertMessage: string = '';
  alertType: string = '';

  constructor(private alertService: AlertService) {
    this.alertService.alert$.subscribe(({ message, type }) => {
      this.showAlert(message, type);
    });
  } 

  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.closeAlert(); 
    }, 5000); 
  }

  closeAlert() {
    this.alertMessage = '';
    this.alertType = '';
  } 
}
