import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  //url base de la api
  private baseUrl = 'https://deckofcardsapi.com/api/deck';

  constructor(
    private http: HttpClient
  ) {}

  /**
   * Crea un nuevo mazo de cartas
   */
  crearMazo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/new/shuffle/?deck_count=1`);
  }

  /**
   * Saca la cantidad de cartas que se le pase del id del mazo que se le pase
   *
   * @param deckId
   * @param count
   */
  sacarCarta(deckId: string, count: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/${deckId}/draw/?count=${count}`);
  }
}
