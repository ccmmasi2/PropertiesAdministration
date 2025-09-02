import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // credenciales quemadas
  login() {
    const credentials = {
      username: 'cristian',
      password: '1234'
    };

    return this.http.post<{ token: string }>(
      `${environment.baseUrl}/api/Auth/login`,
      credentials
    );
  }
}
