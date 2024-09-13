import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import Swal from 'sweetalert2'

/**
 * JuegoDeReflejosComponent handles the logic for the game, including starting
 * and ending the game, updating the score, managing obstacles, and handling
 * user interactions.
 *
 * @Component({
 *  selector: 'app-juego-de-reflejos',
 *  standalone: true,
 *  imports: [
 *    NgStyle,
 *    NgIf,
 *    NgForOf,
 *    NgOptimizedImage
 *  ],
 *  templateUrl: './juego-de-reflejos.component.html',
 *  styleUrl: './juego-de-reflejos.component.less'
 * })
 */
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

  /**
   * Initializes and starts the game.
   * This method will reset the game state, start the game timer,
   * move the player's button to the starting position, and generate
   * a random number of obstacles within the specified range.
   *
   * @return {void} This method does not return a value.
   */
  startGame(): void {
    this.resetGame();
    this.startTimer();
    this.moveButton();

    const randomObstacleCount = Math.floor(Math.random() * (this.maxObstacles - this.minObstacles + 1)) + this.minObstacles;
    this.generateObstacles(randomObstacleCount);
  }

  // Al hacer clic en el botón, aumentar el puntaje y mover el botón
  /**
   * Handles the button click event. This method increments the score, moves the button to a new location, and generates a random number of obstacles within a specified range.
   *
   * @return {void} This method does not return a value.
   */
  onButtonClick(): void {
    this.score++;
    this.moveButton();

    const randomObstacleCount = Math.floor(Math.random() * (this.maxObstacles - this.minObstacles + 1)) + this.minObstacles;
    this.generateObstacles(randomObstacleCount);
  }

  // Penalizar al jugador si hace clic en un obstáculo
  /**
   * Handles the event when an obstacle is clicked in the game. This method
   * triggers a SweetAlert popup indicating the game is over and then
   * proceeds to end the game by calling the endGame method.
   *
   * @return {void} No return value.
   */
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
  /**
   * Moves the button to a new random position within the game area container.
   *
   * This method calculates random positions for the button based on the dimensions
   * of the game area container, ensuring the new position is within the boundaries
   * of the container.
   *
   * @return {void} The method does not return any value.
   */
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
  /**
   * Generates a specified number of obstacles within the game area.
   *
   * @param {number} obstaclesCount - The number of obstacles to generate.
   * @return {void}
   */
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
  /**
   * Starts the game timer with a countdown of 30 seconds.
   * Initializes the score to zero and sets the game status to active.
   * Decrements the time left by 1 every second, and ends the game when time runs out.
   * @return {void}
   */
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
  /**
   * Ends the game by setting the game state to 'over' and hiding the relevant UI elements.
   * Additionally, stops any ongoing game-related timers.
   *
   * @return {void}
   */
  endGame(): void {
    this.gameOver = true;
    this.showButton = false;
    clearInterval(this.timerInterval);
  }

  // Reiniciar el juego
  /**
   * Resets the game to its initial state.
   *
   * This method sets the score to 0, resets the timer to 30 seconds,
   * sets the gameOver flag to false, and clears the timer interval.
   *
   * @return {void} No return value.
   */
  resetGame(): void {
    this.score = 0;
    this.timeLeft = 30;
    this.gameOver = false;
    clearInterval(this.timerInterval);
  }

}
