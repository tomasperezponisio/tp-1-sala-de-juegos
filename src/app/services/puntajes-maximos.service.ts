import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntajesMaximosService {

  constructor(
    private firestore: Firestore
  ) {}

  /**
   * Trae los 10 puntajes máximos de un juego específico
   *
   * @param {string} juego - El nombre del juego del cual traer los puntajes.
   * @return {Observable<any[]>} Un observable que devuelve un array con los puntajes máximos de un juego específico.
   */
  public getPuntajeMaximoPorJuego(juego: string): Observable<any[]> {
    const col = collection(this.firestore, 'puntajes');
    const topScoresQuery = query(
      col,
      where('juego', '==', juego),   // Filter by game
      orderBy('puntaje', 'desc'),     // Order by score in descending order
      limit(10)                       // Limit to top 10 scores
    );

    return from(getDocs(topScoresQuery)
      .then((querySnapshot) =>
      querySnapshot.docs.map(doc => doc.data())
    ));
  }
}
