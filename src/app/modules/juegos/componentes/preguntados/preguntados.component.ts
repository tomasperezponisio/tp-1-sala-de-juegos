import {Component, OnInit} from '@angular/core';
import {SimpsonsService} from '../../../../services/simpsons.service';
import Swal from "sweetalert2";
import {PuntajesService} from "../../../../services/puntajes.service";

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.less'
})
export class PreguntadosComponent implements OnInit {
  public imagenPersonaje: string = '';
  public respuestaCorrecta: string = '';
  public opciones: string[] = [];
  public todosLosPersonajes: any[] = [];
  mensaje: string = '';
  cargando: boolean = false;
  puntaje: number = 0;
  juegoEmpezado: boolean = false;

  constructor(
    private simpsonsService: SimpsonsService,
    private puntajesService: PuntajesService
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Comienza un juego cargando los personajes
   *
   * @return {void}
   */
  startGame() {
    this.cargando = true;
    this.juegoEmpezado = true;
    this.cargarPersonajes();
  }

  /**
   * Trae los personajes utilizando el servicio y los guarda en un array.
   * Genera una pregunta
   * @return {void}
   */
  cargarPersonajes() {
    console.log('entro a loadCharacters');
    this.simpsonsService.getAllCharacters().subscribe(data => {
      this.todosLosPersonajes = data.docs;
      this.generarPregunta();
    });
  }

  /**
   * Genera una pregunta seleccionando un personaje aleatorio de un array de personajes
   * Setea la imagen del personaje elegido, y su nombre como respuesta correcta
   * Se generan dos opciones incorrectas y se mezclan con la correcta
   * @return {void}
   */
  generarPregunta() {
    console.log('entro a generateQuestion');

    const indiceAleatorio = Math.floor(Math.random() * this.todosLosPersonajes.length);
    const personajeElegido = this.todosLosPersonajes[indiceAleatorio];

    this.imagenPersonaje = personajeElegido.Imagen;
    this.respuestaCorrecta = personajeElegido.Nombre;

    const opcionesIncorrectas = this.generarOpcionesIncorrectas(indiceAleatorio);

    this.opciones = this.mezclarOpciones([this.respuestaCorrecta, ...opcionesIncorrectas]);
    this.cargando = false;
  }

  /**
   * Genera un array de dos respuesta incorrectas
   *
   * @param {number} indiceRespuestaCorrecta
   * @return {string[]}
   */
  generarOpcionesIncorrectas(indiceRespuestaCorrecta: number): string[] {
    const respuestasIncorrectas: string[] = [];
    while (respuestasIncorrectas.length < 2) {
      const indiceAleatorio = Math.floor(Math.random() * this.todosLosPersonajes.length);
      if (indiceAleatorio !== indiceRespuestaCorrecta && !respuestasIncorrectas.includes(this.todosLosPersonajes[indiceAleatorio].Nombre)) {
        respuestasIncorrectas.push(this.todosLosPersonajes[indiceAleatorio].Nombre);
      }
    }
    return respuestasIncorrectas;
  }

  /**
   * Mezcla aleatoriamente los elementos del array que recibe
   *
   * @param {string[]} options
   * @return {string[]}
   */
  mezclarOpciones(options: string[]): string[] {
    return options.sort(() => Math.random() - 0.5);
  }

  /**
   * Intenta adivinar el personaje comparando con la respuesta elegida.
   * Actualiza el puntaje y avisa al jugador.
   *
   * @param {string} respuestaSeleccionada
   * @return {void}
   */
  adivinarPersonaje(respuestaSeleccionada: string) {
    if (respuestaSeleccionada === this.respuestaCorrecta) {
      this.puntaje++;
      this.mensaje = `Puntos acumulados: ${this.puntaje}`;
      this.showSuccessAlert(this.mensaje).then(() => {
        this.generarPregunta();
      });
    } else {
      this.mensaje = `El personaje era: ${this.respuestaCorrecta}. Puntos finales: ${this.puntaje}`;
      this.showErrorAlert(this.mensaje).then(() => {
        this.guardaPuntaje(this.puntaje, 'preguntados');
        this.puntaje = 0;
        this.generarPregunta();
      });
    }
  }

  /**
   * Muestra mensaje de exito
   * @param message
   * @private
   */
  private showSuccessAlert(message: string) {
    return Swal.fire({
      title: 'Acertaste!',
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
