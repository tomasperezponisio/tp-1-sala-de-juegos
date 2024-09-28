import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {Auth} from "@angular/fire/auth";
import Swal from "sweetalert2";
import {Subscription} from "rxjs";
import {SalaDeChatService} from '../../services/sala-de-chat.service';
import {DatePipe, NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-sala-de-chat',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    DatePipe,
    NgClass
  ],
  templateUrl: './sala-de-chat.component.html',
  styleUrl: './sala-de-chat.component.less'
})
export class SalaDeChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  public mensaje!: string;
  public mensajesCollection: any[] = [];
  private sub!: Subscription;
  private shouldScroll: boolean = false;

  // Referencia al div de los chats para el autoscroll
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  constructor(
    public auth: Auth,
    private firestore: Firestore,
    private salaDeChatService: SalaDeChatService
  ) {
  }

  /**
   * Me subscribo al metodo `traerMensajes` de `salaDeChatService`.
   * Actualizo `mensajesCollection` con los mensajes recibidos y seteo `shouldScroll` a true.
   *
   * @return {void}
   */
  ngOnInit(): void {
    this.sub = this.salaDeChatService.traerMensajes().subscribe((mensajes) => {
      this.mensajesCollection = mensajes;
      this.shouldScroll = true;
    });
  }

  /**
   *
   * Si `shouldScroll` es true, llamo al metodo `scrollToBottom` para scrollear al fondo automaticamente,
   * después reseteo el flag `shouldScroll` a false.
   *
   * @return {void}
   */
  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false; // Reset the flag after scrolling
    }
  }

  /**
   * Envia un mensaje a la colección "sala-de-chat" en Firestore.
   * Despues de enviar el mensaje resetea el input y scrollea al fondo.
   *
   * @return {void}
   */
  public enviarMensaje() {
    if (this.mensaje.trim()) {
      const col = collection(this.firestore, 'sala-de-chat');
      addDoc(col, {
        fecha: new Date(),
        usuario: this.auth.currentUser?.email,
        mensaje: this.mensaje
      });
      this.mensaje = '';
      this.shouldScroll = true; // Ensure we scroll to the bottom after sending a message
    }
  }

  /**
   * Scrollea al fondo el contenedor de los mensajes.
   * Utiliza la referencia del div #chatMessages
   *
   * @return {void}
   */
  private scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to the bottom: ', err);
    }
  }

  /**
   * Me desubscribo al servicio de mensajes.
   *
   * @return {void} Does not return a value.
   */
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
