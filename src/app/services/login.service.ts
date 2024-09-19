import { Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from '@angular/fire/auth';
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  msjError: string = '';

  constructor(
    public auth: Auth,
    private firestore: Firestore,
  ) { }

  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      // logueo el usuario que ingresó
      let col = collection(this.firestore, 'logins');
      await addDoc(col, {fecha: new Date(), "usuario": email});
      return {success: true, message: 'Login exitoso!'};

    } catch (error) {
      // @ts-ignore
      switch (error.code) {
        case "auth/invalid-email":
          this.msjError = "Email no registrado";
          break;
        case "auth/user-not-found":
          this.msjError = "Email no registrado";
          break;
        case "auth/wrong-password":
          this.msjError = "Contraseña incorrecta";
          break;
        case "auth/invalid-credential":
          this.msjError = "Credenciales inválidas";
          break;
        default:
          this.msjError = "Error al loguearse";
          break;
      }
      // @ts-ignore
      return {success: false, message: this.msjError};
    }
  }

  async register(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      // logueo el usuario que ingresó
      return {success: true, message: 'Login exitoso!'};

    } catch (error) {
      // @ts-ignore
      console.log(error.code);
      // @ts-ignore
      switch (error.code) {
        case "auth/invalid-email":
          this.msjError = "Email inválido";
          break;
        case "auth/email-already-exists":
          this.msjError = "Email ya registrado";
          break;
        case "auth/missing-password":
          this.msjError = "Ingrese una contraseña";
          break;
        case "auth/weak-password":
          this.msjError = "La contraseña es muy débil";
          break;
        default:
          this.msjError = "Error al registrarse";
          break;
      }
      // @ts-ignore
      return {success: false, message: this.msjError};
    }
  }



  // Function to check if a user is logged in or not
/*   isLoggedIn(): Observable<boolean> {
    // TODO: ver aca porque rompe, retornar this.auth.currentUser?.email
    return this.ngFireAuth.authState.pipe(
      map(user => !!user) // Returns true if user exists, otherwise false
    );
  } */

}
