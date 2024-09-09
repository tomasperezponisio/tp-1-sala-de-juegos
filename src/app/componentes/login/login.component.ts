import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HomeComponent} from "../home/home.component";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import Swal from 'sweetalert2'

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
export class LoginComponent {
  usuario!: string;
  password!: string;
  loginExitoso: boolean = false;

  constructor(private router: Router) {}

  validar() {
    if (this.usuario === 'admin' && this.password === 'password') {
      this.loginExitoso = true;
      this.router.navigate(['/home/welcome']);  // Navigate to the 'home' route
    } else {
      this.error();
    }
  }

  autoCompletar() {
    this.usuario = 'admin';
    this.password = 'password';
  }

  error() {
    Swal.fire({
      title: 'Error!',
      text: 'Usuario y contraseña incorrectos.',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
  }
}
