import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HomeComponent} from "../home/home.component";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import Swal from 'sweetalert2';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';
import {addDoc, collection, collectionData, Firestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    HomeComponent,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  msjError: string = "";

  constructor(
    private router: Router,
    public auth: Auth,
    private firestore: Firestore) {
  }

  login() {

    // Step 1: Check if the email is missing or not in a valid format
    if (!this.email || !this.email.trim()) {
      this.msjError = "Ingrese email";
      this.showErrorAlert(this.msjError);
      return;
    } else if (!this.isValidEmail(this.email)) {
      this.msjError = "Email no válido";
      this.showErrorAlert(this.msjError);
      return;
    }

    // Step 2: Check if the password is missing
    if (!this.password || !this.password.trim()) {
      this.msjError = "Ingrese contraseña";
      this.showErrorAlert(this.msjError);
      return;
    }

    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        // mando al home
        this.router.navigate(['/home']);

        // logueo el usuario que ingresó
        let col = collection(this.firestore, 'logins');
        addDoc(col, {fecha: new Date(), "usuario": this.email})

      })
      .catch((e) => {
        switch (e.code) {
          case "auth/invalid-email":
            this.msjError = "Email no registrado";
            break;
          case "auth/user-not-found":  // Non-registered email
            this.msjError = "Email no registrado";
            break;
          case "auth/wrong-password":  // Incorrect password for an existing user
            this.msjError = "Contraseña incorrecta";
            break;
          case "auth/invalid-credential":  // General invalid credential error
            this.msjError = "Credenciales inválidas";
            break;
          default:
            this.msjError = "Error al loguearse";
            console.log(e.code);
            break;
        }
        this.showErrorAlert(this.msjError);
      })
  }

  autoCompletar() {
    this.email = 'admin@gmail.com';
    this.password = 'Admin2024';
  }

  private showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  ngOnInit(): void {
    console.log('email logueado: ' + this.auth.currentUser?.email);
    if (this.auth.currentUser?.email) {
      this.router.navigate(['./home']);
    }
  }

  // TODO: try this:
  // ngOnInit(): void {
  //   this.user$.subscribe(user => {
  //     if (user) {
  //       console.log(`User is logged in: ${user.email}`);
  //       this.router.navigate(['./home']);
  //     } else {
  //       console.log('No user is logged in');
  //     }
  //   });
  // }
}
