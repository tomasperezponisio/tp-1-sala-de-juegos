import {Component, OnDestroy, OnInit} from '@angular/core';
import Swal from 'sweetalert2'
import {PuntajesService} from "../../../../services/puntajes.service";

@Component({
  selector: 'app-juego-de-reflejos',
  templateUrl: './juego-de-reflejos.component.html',
  styleUrl: './juego-de-reflejos.component.less'
})

export class JuegoDeReflejosComponent implements OnInit, OnDestroy {
  puntaje: number = 0;
  tiempoRestante: number = 15;
  gameOver: boolean = false;
  juegoIniciado: boolean = false;
  mostrarBoton: boolean = false;
  tamanioBoton: number = 80;
  maxObstaculos: number = 60;
  minObstaculos: number = 60;
  mensaje: string = '';
  goodSmileyImg: string = 'https://firebasestorage.googleapis.com/v0/b/tp1-sala-de-juegos.appspot.com/o/good-smiley-cropped.png?alt=media&token=6a7fddef-2981-403b-8238-5c326916e3e4';
  badSmileyImg: string = 'https://firebasestorage.googleapis.com/v0/b/tp1-sala-de-juegos.appspot.com/o/bad-smiley-cropped.png?alt=media&token=84eee346-cc0e-4c03-99e3-241dfa1e7240';

  // Posición del botón correcto
  posicionX: number = 0;
  posicionY: number = 0;

  // Arreglo de obstáculos
  obstaculos: { x: number, y: number, isVisible: boolean }[] = [];

  private timerInterval: any;

  // Area de juego
  areaDeJuego: Element | null = null;
  anchoAreaDeJuego?: number;
  altoAreaDeJuego?: number;

  constructor(
    private puntajesService: PuntajesService
  ) {
  }

  ngOnInit(): void {
    this.preCargaDeImagenes();

    clearInterval(this.timerInterval);

    this.areaDeJuego = document.querySelector('.game-area');
    this.anchoAreaDeJuego = this.areaDeJuego?.clientWidth;
    this.altoAreaDeJuego = this.areaDeJuego?.clientHeight;
  }

  // Preload the images
  preCargaDeImagenes(): void {
    const imagesToPreload = [
      this.goodSmileyImg,
      this.badSmileyImg
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  empezarJuego(): void {
    this.juegoIniciado = true;  // NEW: Mark the game as started
    this.reiniciarJuego();
    this.empezarTimer();
    this.moverBoton();

    const randCantidadObstaculos: number = Math.floor(Math.random() * (this.maxObstaculos - this.minObstaculos + 1)) + this.minObstaculos;
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
    this.mensaje = 'Juego terminado! Puntaje final: ' + this.puntaje;
    this.showErrorAlert('Perdiste!', this.mensaje).then(() => {
      this.guardaPuntaje(this.puntaje, 'juego-de-reflejos');
      this.finalizarJuego();
    });
  }

  // Mover el botón a una posición aleatoria dentro del área de juego
  moverBoton(): void {
    if (this.areaDeJuego) {
      if (this.anchoAreaDeJuego && this.altoAreaDeJuego ) {
        // Calcular posiciones aleatorias para el botón correcto
        this.posicionX = Math.floor(Math.random() * (this.anchoAreaDeJuego - (this.tamanioBoton * 2))); // Restar 100 para evitar que salga del contenedor
        this.posicionY = Math.floor(Math.random() * (this.altoAreaDeJuego - (this.tamanioBoton * 2)));
      }
    }
    this.mostrarBoton = true;
  }

  // Generar posiciones aleatorias para los obstáculos
  generarObstaculos(cantidadObstaculos: number): void {
    this.obstaculos = [];  // Reiniciar obstáculos

    const distanciaMinima = this.tamanioBoton * 0.5; // Minimum distance is 30% of the button's size

    if (this.areaDeJuego) {
      if (this.anchoAreaDeJuego && this.altoAreaDeJuego ) {
        for (let i = 0; i < cantidadObstaculos; i++) {
          let x: number;
          let y: number;
          let esPosicionValida: boolean;

          // Genera posiciones hasta que una es valida
          do {
            x = Math.floor(Math.random() * (this.anchoAreaDeJuego - (this.tamanioBoton)));
            y = Math.floor(Math.random() * (this.altoAreaDeJuego - (this.tamanioBoton)));
            esPosicionValida = true;

            // Valida contra la posicion del boton "bueno"
            if (Math.abs(x - this.posicionX) < distanciaMinima && Math.abs(y - this.posicionY) < distanciaMinima) {
              esPosicionValida = false;
            }

            // Valida contra las posiciones de los demas obstaculos
            for (const obstacle of this.obstaculos) {
              if (Math.abs(x - obstacle.x) < distanciaMinima && Math.abs(y - obstacle.y) < distanciaMinima) {
                esPosicionValida = false;
                break;
              }
            }
          } while (!esPosicionValida);

          this.obstaculos.push({x, y, isVisible: true});
        }
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
        this.mensaje = 'Juego terminado! Puntaje final: ' + this.puntaje;
        this.showErrorAlert('Se acabó el tiempo!', this.mensaje).then(() => {
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
    //this.tiempoRestante = 15;
    this.gameOver = false;
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
   * @param titulo
   * @param message
   * @private
   */
  private showErrorAlert(titulo: string, message: string) {
    return Swal.fire({
      title: titulo,
      text: message,
      icon: 'error',
      confirmButtonText: 'Cerrar'
    });
  }

}
