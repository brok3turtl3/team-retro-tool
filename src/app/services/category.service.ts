import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../state/app.state';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    console.log('getCategories swervice HIT!');
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }
}
