import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  // Mock user for testing
  private mockUser = {
    email: 'test@example.com',
    password: 'password123'
  };

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(username: string, email: string, password: string): Observable<User> {
    // Mock registration
    const newUser: User = {
      id: '1',
      username,
      email,
      role: 'user'
    };
    return of(newUser);
  }

  login(email: string, password: string): Observable<User> {
    // Mock authentication
    if (email === this.mockUser.email && password === this.mockUser.password) {
      const user: User = {
        id: '1',
        username: 'Test User',
        email: email,
        role: 'user',
        token: 'mock-jwt-token'
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    }
    return throwError(() => new Error('Invalid email or password'));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}
