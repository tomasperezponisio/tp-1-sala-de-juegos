import { Injectable } from '@angular/core';
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {Auth} from "@angular/fire/auth";
import {Encuesta} from "../models/encuesta";

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  /**
   * Guarda la encuesta en Firestore con los datos proporcionados
   *
   * @param encuesta - Object that contains the survey data
   */
  async guardarEncuesta(encuesta: Encuesta): Promise<void> {
    const user = this.auth.currentUser;

    if (user) {
      const encuestasCollection = collection(this.firestore, 'encuestas');
      await addDoc(encuestasCollection, {
        email: user.email,          // Storing user email
        fecha: new Date(),          // Date of survey submission
        nombre: encuesta.nombre,
        apellido: encuesta.apellido,
        edad: encuesta.edad,
        telefono: encuesta.telefono,
        alumnoRegular: encuesta.alumnoRegular,
        lenguajes: encuesta.lenguajes,  // Storing the languages selected
        feedback: encuesta.feedback,
      });
    }
  }
}
