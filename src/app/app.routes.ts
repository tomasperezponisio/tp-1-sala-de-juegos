import { Routes } from '@angular/router';
import {LoginComponent} from "./componentes/login/login.component";
import {ErrorPageComponent} from "./componentes/error-page/error-page.component";
import {HomeComponent} from "./componentes/home/home.component";
import {AboutComponent} from "./componentes/about/about.component";
import {AhorcadoComponent} from "./componentes/ahorcado/ahorcado.component";
import {MayorOMenorComponent} from "./componentes/mayor-o-menor/mayor-o-menor.component";
import {PreguntadosComponent} from "./componentes/preguntados/preguntados.component";
import {JuegoDeReflejosComponent} from "./componentes/juego-de-reflejos/juego-de-reflejos.component";
import {RegisterComponent} from "./componentes/register/register.component";

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: "full"},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: "about", component: AboutComponent},
  {path: "ahorcado", component: AhorcadoComponent},
  {path: "mayoromenor", component: MayorOMenorComponent},
  {path: "preguntados", component: PreguntadosComponent},
  {path: "juegodereflejos", component: JuegoDeReflejosComponent},
  {path: '**', component: ErrorPageComponent},
];
