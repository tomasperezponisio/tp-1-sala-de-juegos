import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit {
  usuarioLogueado: string | null | undefined;

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    console.log('home onInit - email logueado: ' + this.auth.currentUser?.email)
    this.usuarioLogueado = this.auth.currentUser?.email;
    if (!this.auth.currentUser?.email) {
      this.router.navigate(['./login']);
    }

  }

}
