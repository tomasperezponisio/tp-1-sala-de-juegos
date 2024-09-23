import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {Auth, signOut} from "@angular/fire/auth";
import {AsyncPipe, NgIf} from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.less'
})
export class NavBarComponent implements OnInit {
  usuarioLogueado: string | null | undefined;

  constructor(
    private router: Router,
    public auth: Auth
  ) {
  }

  ngOnInit(): void {
    console.log('nav-bar onInit - email logueado: ' + this.usuarioLogueado)
    this.usuarioLogueado = this.auth.currentUser?.email;
  }

  closeSession(){
    signOut(this.auth).then(() => {
      this.showErrorAlert("Logueate para acceder a los juegos");
    })
  }

  private showErrorAlert(message: string) {
    Swal.fire({
      title: 'Cerraste sesión!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
  }
}
