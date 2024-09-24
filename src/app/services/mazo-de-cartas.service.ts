import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private baseUrl = 'https://deckofcardsapi.com/api/deck';

  constructor(
    private http: HttpClient
  ) {}

  // Create a new shuffled deck
  crearMazo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/new/shuffle/?deck_count=1`);
  }

  // Draw a card from the deck
  sacarCarta(deckId: string, count: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/${deckId}/draw/?count=${count}`);
  }
}
