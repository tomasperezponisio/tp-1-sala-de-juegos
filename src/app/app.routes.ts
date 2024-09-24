import {Routes} from '@angular/router';
import {LoginComponent} from "./componentes/login/login.component";
import {RegisterComponent} from "./componentes/register/register.component";
import {HomeComponent} from "./componentes/home/home.component";
import {AboutComponent} from "./componentes/about/about.component";
import {ErrorPageComponent} from "./componentes/error-page/error-page.component";
import {SalaDeChatComponent} from "./componentes/sala-de-chat/sala-de-chat.component";

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: "full"},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: "about", component: AboutComponent},
  {path: 'juegos', loadChildren:() => import('./modules/juegos/juegos.module').then(m => m.JuegosModule)},
  {path: 'sala-de-chat', component: SalaDeChatComponent},
  {path: '**', component: ErrorPageComponent},
];
