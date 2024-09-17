import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-juego-de-reflejos',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgForOf,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './juego-de-reflejos.component.html',
  styleUrl: './juego-de-reflejos.component.less'
})

export class JuegoDeReflejosComponent implements OnInit {
  //TODO: fix start/end of the game
  score = 0;
  timeLeft = 30;
  gameOver = false;
  showButton = false;
  buttonsSize = 80;
  maxObstacles = 120;
  minObstacles = 90;

  // Posición del botón correcto
  positionX = 0;
  positionY = 0;

  // Arreglo de obstáculos
  obstacles: {x: number, y: number, isVisible: boolean}[] = [];

  private timerInterval: any;
  //private obstacleCount = 3;  // Número de obstáculos

  constructor() {}

  ngOnInit(): void {
    this.startGame();
  }

  startGame(): void {
    this.resetGame();
    this.startTimer();
    this.moveButton();

    const randomObstacleCount = Math.floor(Math.random() * (this.maxObstacles - this.minObstacles + 1)) + this.minObstacles;
    this.generateObstacles(randomObstacleCount);
  }

  // Al hacer clic en el botón, aumentar el puntaje y mover el botón
  onButtonClick(): void {
    this.score++;
    this.moveButton();

    const randomObstacleCount = Math.floor(Math.random() * (this.maxObstacles - this.minObstacles + 1)) + this.minObstacles;
    this.generateObstacles(randomObstacleCount);
  }

  // Penalizar al jugador si hace clic en un obstáculo
  onObstacleClick(): void {
    Swal.fire({
      title: '¡Oh no!',
      text: 'Hiciste clic en un obstáculo. ¡Juego terminado!',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    this.endGame();
  }

  // Mover el botón a una posición aleatoria dentro del área de juego
  moveButton(): void {
    const gameArea = document.querySelector('.container');
    if (gameArea) {
      const width = gameArea.clientWidth;
      const height = gameArea.clientHeight;

      // Calcular posiciones aleatorias para el botón correcto
      this.positionX = Math.floor(Math.random() * (width - (this.buttonsSize * 2))); // Restar 100 para evitar que salga del contenedor
      this.positionY = Math.floor(Math.random() * (height - (this.buttonsSize * 2)));
    }
    this.showButton = true;
  }

  // Generar posiciones aleatorias para los obstáculos
  generateObstacles(obstaclesCount: number): void {
    this.obstacles = [];  // Reiniciar obstáculos

    const gameArea = document.querySelector('.container');
    const minDistance = this.buttonsSize * 0.5; // Minimum distance is 30% of the button's size

    if (gameArea) {
      const width = gameArea.clientWidth;
      const height = gameArea.clientHeight;

      for (let i = 0; i < obstaclesCount; i++) {
        let x: number;
        let y: number;
        let isValidPosition: boolean;

        // Keep generating positions until a valid one is found
        do {
          x = Math.floor(Math.random() * (width - (this.buttonsSize * 2)));
          y = Math.floor(Math.random() * (height - (this.buttonsSize * 2)));
          isValidPosition = true;

          // Check against the position of the main button
          if (Math.abs(x - this.positionX) < minDistance && Math.abs(y - this.positionY) < minDistance) {
            isValidPosition = false;
          }

          // Check against the positions of existing obstacles
          for (const obstacle of this.obstacles) {
            if (Math.abs(x - obstacle.x) < minDistance && Math.abs(y - obstacle.y) < minDistance) {
              isValidPosition = false;
              break;
            }
          }
        } while (!isValidPosition);

        this.obstacles.push({ x, y, isVisible: true });
      }
    }
  }

  // Iniciar el temporizador
  startTimer(): void {
    this.timeLeft = 30;
    this.score = 0;
    this.gameOver = false;

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  // Terminar el juego
  endGame(): void {
    this.gameOver = true;
    this.showButton = false;
    clearInterval(this.timerInterval);
  }

  // Reiniciar el juego
  resetGame(): void {
    this.score = 0;
    this.timeLeft = 30;
    this.gameOver = false;
    clearInterval(this.timerInterval);
  }

}
