import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import Swal from 'sweetalert2';
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent {
  email: string = "";
  password: string = "";
  passwordCheck: string = "";

  loggedUser: string = "";
  msjError: string = "";
  msjExito: string = "";

  constructor(
    private router: Router,
    public auth: Auth,
    private firestore: Firestore) {
  }

  register() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password).then((res) => {
      if (res.user.email !== null) this.loggedUser = res.user.email;
      this.msjExito = 'Usuario: ' + res.user.email + ' registrado';
      this.showSuccessAlert(this.msjExito);
      signInWithEmailAndPassword(this.auth, this.email, this.password)
        .then((res) => {
          // logueo el usuario que ingresó
          let col = collection(this.firestore, 'logins');
          addDoc(col, {fecha: new Date(), "usuario": this.email})

          // mando al home
          this.router.navigate(['/home']);
      })
        .catch((e) => {
          this.msjError = e.code;
          this.showErrorAlert(this.msjError);
      });

    }).catch((e) => {

      switch (e.code) {
        case "auth/invalid-email":
          this.msjError = "Email invalido";
          break;
        case "auth/email-already-in-use":
          this.msjError = "Email ya en uso";
          break;
        default:
          this.msjError = e.code
          break;
      }

      this.showErrorAlert(this.msjError);

    });
  }

  private showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
  }

  private showSuccessAlert(message: string) {
    Swal.fire({
      title: 'Registro exisoto!',
      text: this.msjExito,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

}
