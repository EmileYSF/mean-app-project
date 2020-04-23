import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authURL = 'http://localhost:3000/api/users';
  private authToken: string;
  private tokenTimer: NodeJS.Timeout;
  private userId: string;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient, private router: Router) {}

  getUserId() {
    return this.userId;
  }

  getAuthToken() {
    return this.authToken;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const auth: Auth = {
      email: email,
      password: password,
    };
    this.httpClient.post(this.authURL + '/signup', auth).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  loginUser(email: string, password: string) {
    const auth: Auth = {
      email: email,
      password: password,
    };
    this.httpClient
      .post<{ token: string; expiresIn: number; userId: string }>(
        this.authURL + '/login',
        auth
      )
      .subscribe(
        (response) => {
          this.authToken = response.token;
          if (response.token) {
            this.setAuthTimer(response.expiresIn);
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const nowDate = new Date();
            const expirationDate = new Date(
              nowDate.getTime() + response.expiresIn * 1000
            );
            this.saveAuthData(response.token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const nowDate = new Date();
    const expiresIn =
      authInformation.expirationDate.getTime() - nowDate.getTime();
    if (expiresIn > 0) {
      this.authToken = authInformation.token;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logoutUser() {
    this.authToken = null;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string
  ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }
}
