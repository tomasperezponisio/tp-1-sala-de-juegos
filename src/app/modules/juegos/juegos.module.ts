import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { PreguntadosComponent } from './componentes/preguntados/preguntados.component';
import { MayorOMenorComponent } from './componentes/mayor-o-menor/mayor-o-menor.component';
import { JuegoDeReflejosComponent } from './componentes/juego-de-reflejos/juego-de-reflejos.component';


@NgModule({
  declarations: [
    AhorcadoComponent,
    PreguntadosComponent,
    MayorOMenorComponent,
    JuegoDeReflejosComponent
  ],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule { }
