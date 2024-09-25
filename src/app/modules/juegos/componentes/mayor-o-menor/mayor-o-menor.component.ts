import {Component, OnInit} from '@angular/core';
import {DeckService} from '../../../../services/mazo-de-cartas.service';
import {PuntajesService} from '../../../../services/puntajes.service';

@Component({
  selector: 'app-mayor-o-menor',
  templateUrl: './mayor-o-menor.component.html',
  styleUrl: './mayor-o-menor.component.less'
})
export class MayorOMenorComponent implements OnInit {
  deckId: string = '';
  cartaActual: any;
  cartaProxima: any;
  puntaje: number = 0;
  gameOver: boolean = false;
  mensaje: string = '';
  loading: boolean = false;

  constructor(
    private deckService: DeckService,
    private puntajesService: PuntajesService
  ) {
  }

  ngOnInit(): void {
    this.comenzarJuego();
  }

  /**
   * Comienza un nuevo juego creando un mazo y sacando una carta
   */
  comenzarJuego() {
    this.deckService.crearMazo().subscribe((data) => {
      this.deckId = data.deck_id;
      this.sacarCarta();
    });
  }

  /**
   * Saca una carta del mazo creado y la asigna a cartaActual
   */
  sacarCarta() {
    this.deckService.sacarCarta(this.deckId).subscribe((data) => {
      if (data.cards && data.cards.length > 0) {
        this.cartaActual = data.cards[0];
        this.loading = false;
      }
    });
  }

  /**
   * Sacar una carta del mazo y la compara con la carta actual,
   * define si el jugador perdió o ganó.
   *
   * @param adivinar
   */
  adivinarCarta(adivinar: 'mayor' | 'menor') {
    this.loading = true;
    this.deckService.sacarCarta(this.deckId).subscribe((data) => {
      if (data.cards && data.cards.length > 0) {
        this.cartaProxima = data.cards[0];  // se asigna a cartaProxima para comparar
        const valorActual = this.calcularValorCarta(this.cartaActual.value);
        const valorProximo = this.calcularValorCarta(this.cartaProxima.value);

        // Validaciones para ver si ganó o perdió
        if (valorProximo === valorActual) {
          this.mensaje = 'Perdiste! Las cartas eran iguales.';
          this.gameOver = true;
          this.guardaPuntaje();

        } else if (
          (adivinar === 'mayor' && valorProximo > valorActual) ||
          (adivinar === 'menor' && valorProximo < valorActual)
        ) {
          this.puntaje++;
          this.mensaje = 'Acertaste! Ganaste un punto.';
          this.cartaActual = this.cartaProxima;  // Actualizdo la cartaActual
        } else {
          this.mensaje = `Perdiste! La próxima carta era ${this.traducirValorCarta(this.cartaProxima.value)} de ${this.traducirPaloCarta(this.cartaProxima.suit)}.`;
          this.gameOver = true;
          this.guardaPuntaje();

        }
      }
      this.loading = false;
    });
  }

  /**
   * Convierte a numero el valor de la carta en caso de as, sota, reina o rey
   *
   * @param valor
   */
  calcularValorCarta(valor: string): number {
    switch (valor) {
      case 'ACE':
        return 1;
      case 'JACK':
        return 11;
      case 'QUEEN':
        return 12;
      case 'KING':
        return 13;
      default:
        return parseInt(valor, 10);
    }
  }

  /**
   * Traduce el palo de la carta
   *
   * @param palo
   */
  traducirPaloCarta(palo: string): string {
    switch (palo) {
      case 'CLUBS':
        return 'Trébol';
      case 'DIAMONDS':
        return 'Diamante';
      case 'HEARTS':
        return 'Corazones';
      default:
        return 'Pica';
    }
  }

  /**
   * Traudce el valor de las carta en caso de sota, reina o rey
   *
   * @param valor
   */
  traducirValorCarta(valor: string): string {
    switch (valor) {
      case 'ACE':
        return 'As';
      case 'JACK':
        return 'Sota';
      case 'QUEEN':
        return 'Reina';
      case 'KING':
        return 'Rey';
      default:
        return valor;
    }
  }

  /**
   * Reinicia el juego
   */
  reiniciarJuego() {
    this.puntaje = 0;
    this.gameOver = false;
    this.mensaje = '';
    this.comenzarJuego();
  }

  /**
   * Guarda el puntaje del jugador
   */
  async guardaPuntaje() {
    try {
      await this.puntajesService.guardarPuntaje(this.puntaje, 'mayor-o-menor');
      console.log('Puntaje guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el puntaje: ', error);
    }
  }
}
