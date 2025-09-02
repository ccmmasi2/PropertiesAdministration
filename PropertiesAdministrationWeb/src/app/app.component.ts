import { Component, OnInit } from '@angular/core';
import { AlertService } from './services/alert-service.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  title = 'order web angular';
  alertMessage: string = '';
  alertType: string = '';

  constructor(private alertService: AlertService, private authService: AuthService) {
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

   ngOnInit() {
    this.authService.login().subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
      },
      error: (err) => {
        console.error('Error en login:', err);
      }
    });
  }
}
