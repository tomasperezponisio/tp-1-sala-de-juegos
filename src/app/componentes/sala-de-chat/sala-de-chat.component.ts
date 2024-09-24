import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class SalaDeChatComponent implements OnInit, OnDestroy {
  public mensaje!: string;
  public mensajesCollection:any[] = [];
  private sub!:Subscription;

  constructor(
    public auth: Auth,
    private firestore: Firestore,
    private salaDeChatService: SalaDeChatService
  ) {
  }

  ngOnInit(): void {
    // Subscribe to the service to get real-time updates
    this.sub = this.salaDeChatService.traerMensajes().subscribe((mensajes) => {
      this.mensajesCollection = mensajes;
    });
  }

  // Function to send a message
  public enviarMensaje() {
    if (this.mensaje.trim()) {
      const col = collection(this.firestore, 'sala-de-chat');
      addDoc(col, {
        fecha: new Date(),
        usuario: this.auth.currentUser?.email,
        mensaje: this.mensaje
      });
      this.mensaje = '';
    }
  }

  private showSuccessAlert(message: string) {
    return Swal.fire({
      title: 'Sala de Chat',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe when the component is destroyed to prevent memory leaks
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
