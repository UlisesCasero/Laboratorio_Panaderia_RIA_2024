import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:3000/usuarios/login', credentials);
  }
}
