import { Routes } from '@angular/router';
import {LoginComponent} from "./componentes/login/login.component";
import {ErrorPageComponent} from "./componentes/error-page/error-page.component";
import {HomeComponent} from "./componentes/home/home.component";
import {AboutComponent} from "./componentes/about/about.component";
import {Juego1Component} from "./componentes/juego1/juego1.component";
import {Juego2Component} from "./componentes/juego2/juego2.component";
import {Juego3Component} from "./componentes/juego3/juego3.component";
import {Juego4Component} from "./componentes/juego4/juego4.component";
import {WelcomeComponent} from "./componentes/welcome/welcome.component";

export const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: "full"},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent,
    children:
      [
        {path: '', redirectTo: 'home', pathMatch: "full"},
        {path: "welcome", component: WelcomeComponent},
        {path: "about", component: AboutComponent},
        {path: "juego1", component: Juego1Component},
        {path: "juego2", component: Juego2Component},
        {path: "juego3", component: Juego3Component},
        {path: "juego4", component: Juego4Component},
      ]
  },
  {path: '**', component: ErrorPageComponent},
];
