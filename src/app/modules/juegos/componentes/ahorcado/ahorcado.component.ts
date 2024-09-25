import {Component} from '@angular/core';
import {palabras} from './palabras';
import {PuntajesService} from '../../../../services/puntajes.service'
import Swal from "sweetalert2";

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.less'
})
export class AhorcadoComponent {
  imrUrlBase: string = 'https://firebasestorage.googleapis.com/v0/b/tp1-sala-de-juegos.appspot.com/o';
  palabra: string = '';  // The random word to guess
  letrasUsadas: string[] = [];  // Letters the player has guessed
  palabraOculta: string[] = [];  // Word display with underscores
  maximoDeIntentos: number = 6;  // Max incorrect guesses before game over
  errores: number = 0;  // Count incorrect guesses
  gameOver: boolean = false;  // Tracks if the game is over
  mensaje: string = '';  // Game over message
  juegoIniciado: boolean = false;  // Track whether the game has started
  puntaje: number = 0;  // Track the player's score

  // Alphabet for the on-screen keyboard
  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.toLowerCase().split('');

  constructor(
    private puntajesService: PuntajesService
  ) {
  }

  // Start a new game
  comenzarJuego() {
    const indiceRandom = Math.floor(Math.random() * palabras.length);
    this.palabra = palabras[indiceRandom].toLowerCase();  // Select random word from array
    this.palabraOculta = Array(this.palabra.length).fill('_');  // Initialize display with underscores
    this.letrasUsadas = [];
    this.errores = 0;
    this.gameOver = false;
    this.mensaje = '';
    this.juegoIniciado = true;  // Set the game as started
  }

  // Handle player's guess
  adivinarLetra(letter: string) {
    if (this.gameOver || this.letrasUsadas.includes(letter)) {
      return;  // Do nothing if game is over or letter already guessed
    }

    this.letrasUsadas.push(letter);  // Add guessed letter to the array

    if (this.palabra.includes(letter)) {
      // Correct guess: update the displayWord
      for (let i = 0; i < this.palabra.length; i++) {
        if (this.palabra[i] === letter) {
          this.palabraOculta[i] = letter;
        }
      }

      // Valida si el jugador ganó
      if (!this.palabraOculta.includes('_')) {
        this.puntaje++;  // Increase score for a correct word
        this.mensaje = `La palabra era: ${this.palabra}. Puntos acumulados: ${this.puntaje}`;
        this.showSuccessAlert(this.mensaje).then(() => {
          this.comenzarJuego();
        });
      }
    } else {
      // Errores
      this.errores++;
      if (this.errores >= this.maximoDeIntentos) {
        this.mensaje = `La palabra era: ${this.palabra}. Puntos finales: ${this.puntaje}`;
        this.showErrorAlert(this.mensaje).then(() => {
          this.guardaPuntaje(this.puntaje, 'ahorcado');
          this.gameOver = true;
        });
      }
    }
  }

  /**
   * Reinicia el juego
   */
  reiniciarJuego() {
    this.puntaje = 0;  // Reset the score
    this.comenzarJuego();
  }

  /**
   * Muestra mensaje de exito
   * @param message
   * @private
   */
  private showSuccessAlert(message: string) {
    return Swal.fire({
      title: 'Ganaste!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  /**
   * Muestra mensaje de error
   * @param message
   * @private
   */
  private showErrorAlert(message: string) {
    return Swal.fire({
      title: 'Perdiste!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
  }

  /**
   * Guarda el puntaje del jugador
   */
  async guardaPuntaje(puntaje: number, juego: string) {
    try {
      await this.puntajesService.guardarPuntaje(puntaje, juego);
      console.log('Puntaje guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el puntaje: ', error);
    }
  }

}
