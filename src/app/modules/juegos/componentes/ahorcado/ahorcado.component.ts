import {Component} from '@angular/core';
import {palabras} from './palabras';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.less'
})
export class AhorcadoComponent {

  palabra: string = '';  // The random word to guess
  letrasUsadas: string[] = [];  // Letters the player has guessed
  palabraOculta: string[] = [];  // Word display with underscores
  maximoDeIntentos: number = 6;  // Max incorrect guesses before game over
  errores: number = 0;  // Count incorrect guesses
  gameOver: boolean = false;  // Tracks if the game is over
  mensaje: string = '';  // Game over message
  juegoIniciado: boolean = false;  // Track whether the game has started
  score: number = 0;  // Track the player's score

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

      // Check if the player has won
      if (!this.palabraOculta.includes('_')) {
        this.score++;  // Increase score for a correct word
        this.mensaje = `¡Felicidades! Has adivinado la palabra. Puntos: ${this.score}`;
        this.comenzarJuego();  // Automatically start a new word
      }
    } else {
      // Incorrect guess
      this.errores++;
      if (this.errores >= this.maximoDeIntentos) {
        this.gameOver = true;
        this.mensaje = `Has perdido. La palabra era: ${this.palabra}. Puntos finales: ${this.score}`;
      }
    }
  }

  // Reset the game
  reiniciarJuego() {
    this.score = 0;  // Reset the score
    this.comenzarJuego();
  }

}
