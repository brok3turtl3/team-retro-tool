import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private tokenKey = 'authToken';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response: any) => {
        //----- save token in localStorage
        localStorage.setItem(this.tokenKey, response.access_token);
        //----- save user details for role checking
        this.userSubject.next(response.user);
        return response;
      })
    );
  }

  logout() {
    //----- clear token and user details
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    return this.userSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'Admin';
  }

  fetchUserDetails(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return new Observable((subscriber) => {
        subscriber.error('No token found');
      });
    }

    return this.http
      .get(`${this.apiUrl}/user`, {
        headers: { Authorization: token },
      })
      .pipe(
        map((response: any) => {
          this.userSubject.next(response);
          return response;
        })
      );
  }
}
