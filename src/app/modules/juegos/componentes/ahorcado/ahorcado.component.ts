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
  imgUrlBase: string = 'https://firebasestorage.googleapis.com/v0/b/tp1-sala-de-juegos.appspot.com/o';
  imgUrls: string [] = [];
  palabra: string = '';
  letrasUsadas: string[] = [];
  palabraOculta: string[] = [];
  maximoDeIntentos: number = 6;
  errores: number = 0;
  gameOver: boolean = false;
  mensaje: string = '';
  juegoIniciado: boolean = false;
  puntaje: number = 0;

  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.toLowerCase().split('');

  constructor(
    private puntajesService: PuntajesService
  ) {
  }

  // Cargo las imagenes del ahorcado en memoria
  ngOnInit(): void {
    this.imgUrls[0] = this.imgUrlBase + '/hangman01.jpg?alt=media&token=621ef5e3-3432-4371-9374-bb616a0c8fce';
    this.imgUrls[1] = this.imgUrlBase + '/hangman02.jpg?alt=media&token=2918ef5d-ab69-49bf-aa26-ecfc272c3dbe';
    this.imgUrls[2] = this.imgUrlBase + '/hangman03.jpg?alt=media&token=bceba62c-a3b6-48ee-993a-a949a3423b1c';
    this.imgUrls[3] = this.imgUrlBase + '/hangman04.jpg?alt=media&token=e7283828-40c2-40c4-9f95-6d602b8e3c34';
    this.imgUrls[4] = this.imgUrlBase + '/hangman05.jpg?alt=media&token=5b7743d2-ad9d-448c-8b39-3479ef0b528b';
    this.imgUrls[5] = this.imgUrlBase + '/hangman06.jpg?alt=media&token=bc2f7c77-ff60-4bb3-a263-280d0083a706';
    this.imgUrls[5] = this.imgUrlBase + '/hangman07.jpg?alt=media&token=9fe787ed-7def-486a-ae7a-184ea5e2f2ef';
  }


  /**
   * Inicia un juego nuevo seleccionando una palabra aleatoria del array
   * reseta las variables del juego, y setea en true a `juegoIniciado`
   *
   * @return {void}
   */
  comenzarJuego(): void {
    const indiceRandom = Math.floor(Math.random() * palabras.length);
    this.palabra = palabras[indiceRandom].toLowerCase();
    this.palabraOculta = Array(this.palabra.length).fill('_');
    this.letrasUsadas = [];
    this.errores = 0;
    this.gameOver = false;
    this.mensaje = '';
    this.juegoIniciado = true;
    console.log(this.palabra);
  }

  /**
   * Maneja la lógica de adivinar una letra de la palabra secreta.
   *
   * @param letter The letter being guessed by the player.
   * @return void
   */
  adivinarLetra(letter: string): void {
    if (this.gameOver || this.letrasUsadas.includes(letter)) {
      return;
    }

    this.letrasUsadas.push(letter);

    if (this.palabra.includes(letter)) {
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
        this.errores = 0;
      }
    }
  }

  /**
   * Reinicia el juego
   */
  reiniciarJuego() {
    this.puntaje = 0;
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
