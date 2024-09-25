import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PuntajesService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  /**
   * Guarda el puntaje en un juego determinado para el usuario logueado que lo jugó
   *
   * @param puntaje
   * @param juego
   */
  async guardarPuntaje(puntaje: number, juego: string) {
    const user = this.auth.currentUser;

    if (user) {
      const puntajesCollection = collection(this.firestore, 'puntajes');
      await addDoc(puntajesCollection, {
        email: user.email,
        juego,
        puntaje,
        fecha: new Date(),
      });
    }
  }
}
