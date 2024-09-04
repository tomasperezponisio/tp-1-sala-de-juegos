import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HomeComponent} from "../home/home.component";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

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
      this.router.navigate(['/home']);  // Navigate to the 'home' route
    } else {
      this.loginExitoso = false;
    }
  }
}
