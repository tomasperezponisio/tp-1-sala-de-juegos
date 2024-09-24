import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AhorcadoComponent} from "./componentes/ahorcado/ahorcado.component";
import {MayorOMenorComponent} from "./componentes/mayor-o-menor/mayor-o-menor.component";
import {PreguntadosComponent} from "./componentes/preguntados/preguntados.component";
import {JuegoDeReflejosComponent} from "./componentes/juego-de-reflejos/juego-de-reflejos.component";

const routes: Routes = [
  {path: "ahorcado", component: AhorcadoComponent},
  {path: "mayoromenor", component: MayorOMenorComponent},
  {path: "preguntados", component: PreguntadosComponent},
  {path: "juegodereflejos", component: JuegoDeReflejosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
