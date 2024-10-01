import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2'
import {PuntajesService} from "../../../../services/puntajes.service";

@Component({
  selector: 'app-juego-de-reflejos',
  templateUrl: './juego-de-reflejos.component.html',
  styleUrl: './juego-de-reflejos.component.less'
})

export class JuegoDeReflejosComponent implements OnInit {
  //TODO: fix start/end of the game
  puntaje = 0;
  tiempoRestante = 15;
  gameOver = false;
  mostrarBoton = false;
  tamanioBoton = 80;
  maxObstaculos = 120;
  minObstaculos = 90;
  mensaje: string = '';
  public goodSmileyImg: string = 'https://firebasestorage.googleapis.com/v0/b/tp1-sala-de-juegos.appspot.com/o/good-smiley-cropped.png?alt=media&token=6a7fddef-2981-403b-8238-5c326916e3e4';
  public badSmileyImg: string = 'https://firebasestorage.googleapis.com/v0/b/tp1-sala-de-juegos.appspot.com/o/bad-smiley-cropped.png?alt=media&token=84eee346-cc0e-4c03-99e3-241dfa1e7240';

  // Posición del botón correcto
  posicionX = 0;
  posicionY = 0;

  // Arreglo de obstáculos
  obstaculos: {x: number, y: number, isVisible: boolean}[] = [];

  private timerInterval: any;
  //private obstacleCount = 3;  // Número de obstáculos

  constructor(
    private puntajesService: PuntajesService
  ) {}

  ngOnInit(): void {
    this.empezarJuego();
  }

  empezarJuego(): void {
    this.reiniciarJuego();
    this.empezarTimer();
    this.moverBoton();

    const randCantidadObstaculos = Math.floor(Math.random() * (this.maxObstaculos - this.minObstaculos + 1)) + this.minObstaculos;
    this.generarObstaculos(randCantidadObstaculos);
  }

  // Al hacer clic en el botón, aumentar el puntaje y mover el botón
  onButtonClick(): void {
    this.puntaje++;
    this.moverBoton();

    const randCantidadObstaculos = Math.floor(Math.random() * (this.maxObstaculos - this.minObstaculos + 1)) + this.minObstaculos;
    this.generarObstaculos(randCantidadObstaculos);
  }

  // Penalizar al jugador si hace clic en un obstáculo
  alClickearUnObstaculo(): void {
    this.mensaje = 'Hiciste clic en un obstáculo. ¡Juego terminado!';
    this.showErrorAlert(this.mensaje).then(() => {
      this.guardaPuntaje(this.puntaje, 'juego-de-reflejos');
      this.finalizarJuego();
    });
  }

  // Mover el botón a una posición aleatoria dentro del área de juego
  moverBoton(): void {
    const areaDeJuego = document.querySelector('.container');
    if (areaDeJuego) {
      const width = areaDeJuego.clientWidth;
      const height = areaDeJuego.clientHeight;

      // Calcular posiciones aleatorias para el botón correcto
      this.posicionX = Math.floor(Math.random() * (width - (this.tamanioBoton * 2))); // Restar 100 para evitar que salga del contenedor
      this.posicionY = Math.floor(Math.random() * (height - (this.tamanioBoton * 2)));
    }
    this.mostrarBoton = true;
  }

  // Generar posiciones aleatorias para los obstáculos
  generarObstaculos(cantidadObstaculos: number): void {
    this.obstaculos = [];  // Reiniciar obstáculos

    const areaDeJuego = document.querySelector('.container');
    const distanciaMinima = this.tamanioBoton * 0.5; // Minimum distance is 30% of the button's size

    if (areaDeJuego) {
      const width = areaDeJuego.clientWidth;
      const height = areaDeJuego.clientHeight;

      for (let i = 0; i < cantidadObstaculos; i++) {
        let x: number;
        let y: number;
        let esPosicionValida: boolean;

        // Keep generating positions until a valid one is found
        do {
          x = Math.floor(Math.random() * (width - (this.tamanioBoton * 2)));
          y = Math.floor(Math.random() * (height - (this.tamanioBoton * 2)));
          esPosicionValida = true;

          // Check against the position of the main button
          if (Math.abs(x - this.posicionX) < distanciaMinima && Math.abs(y - this.posicionY) < distanciaMinima) {
            esPosicionValida = false;
          }

          // Check against the positions of existing obstacles
          for (const obstacle of this.obstaculos) {
            if (Math.abs(x - obstacle.x) < distanciaMinima && Math.abs(y - obstacle.y) < distanciaMinima) {
              esPosicionValida = false;
              break;
            }
          }
        } while (!esPosicionValida);

        this.obstaculos.push({ x, y, isVisible: true });
      }
    }
  }

  // Iniciar el temporizador
  empezarTimer(): void {
    this.tiempoRestante = 15;
    this.puntaje = 0;
    this.gameOver = false;

    this.timerInterval = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.mensaje = 'Se acabo el tiempo! Juego terminado!';
        this.showErrorAlert(this.mensaje).then(() => {
          this.guardaPuntaje(this.puntaje, 'juego-de-reflejos');
          this.finalizarJuego();
        });
        this.finalizarJuego();
      }
    }, 1000);
  }

  // Terminar el juego
  finalizarJuego(): void {
    this.gameOver = true;
    this.mostrarBoton = false;
    clearInterval(this.timerInterval);
  }

  // Reiniciar el juego
  reiniciarJuego(): void {
    this.puntaje = 0;
    this.tiempoRestante = 30;
    this.gameOver = false;
    clearInterval(this.timerInterval);
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

}
