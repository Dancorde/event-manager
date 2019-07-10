import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, (error) => {
        this.authStatusListener.next(false);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      }, (error) => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformaion = this.getAuthData();
    if (!authInformaion) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformaion.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformaion.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}
