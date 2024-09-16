import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {Auth, user, signOut} from "@angular/fire/auth";
import {AsyncPipe, NgIf} from "@angular/common";
import {map, Observable} from "rxjs";

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
  logueado$!: Observable<boolean>;

  constructor(
    private router: Router,
    public auth: Auth
  ) {
  }

  ngOnInit(): void {
    this.logueado$ = user(this.auth).pipe(map(user => !!user));  // Updates logueado$ based on user's auth state
  }

  closeSession(){
    signOut(this.auth).then(() => {
      this.router.navigate(['../login']);
    })
  }
}
