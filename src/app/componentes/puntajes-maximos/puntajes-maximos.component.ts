import {Component, OnInit} from '@angular/core';
import {PuntajesMaximosService} from "../../services/puntajes-maximos.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-puntajes-maximos',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './puntajes-maximos.component.html',
  styleUrl: './puntajes-maximos.component.less'
})
export class PuntajesMaximosComponent implements OnInit {
  public puntajesMaximos: any[] = [];
  public juegoSeleccionado: string = 'mayor-o-menor';
  public nombreDeJuego: string = '';

  constructor(
    private puntajesMaximosService: PuntajesMaximosService
  ) {}

  ngOnInit(): void {
    this.nombreDeJuego = this.formatearNombreDeJuego();
    this.getPuntajesMaximos();
  }

  /**
   * Obtiene a través de `puntajesMaximosService` los puntajes máximos para el juego seleccionado
   * y asigna el resultado a `puntajesMaximos`
   *
   * @return {void}
   */
  private getPuntajesMaximos(): void {
    this.puntajesMaximosService.getPuntajeMaximoPorJuego(this.juegoSeleccionado).subscribe((puntajes) => {
      this.puntajesMaximos = puntajes;
    });
  }

  /**
   * Actualiza al cambiar el juego seleccionado trayendo los puntajes máximos
   * del mismo.
   *
   * @param {string} juegoNuevo
   * @return {void}
   */
  protected alCambiarDejuego(juegoNuevo: string): void {
    this.juegoSeleccionado = juegoNuevo;
    this.nombreDeJuego = this.formatearNombreDeJuego();
    this.getPuntajesMaximos();  // Fetch the new top scores
  }

  /**
   * Formatea el nombre del juego seleccionado
   *
   * @return string.
   */
  private formatearNombreDeJuego(): string {
    const nombreFormateado = this.juegoSeleccionado.replace(/-/g, ' ');
    return nombreFormateado.charAt(0).toUpperCase() + nombreFormateado.slice(1).toLowerCase();
  }

}
