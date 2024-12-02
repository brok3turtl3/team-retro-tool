import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card } from '../state/app.state';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.baseUrl}/cards`);
  }
}
