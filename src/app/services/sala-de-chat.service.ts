import { Injectable } from '@angular/core';
import {collection, collectionData, Firestore, orderBy, query} from "@angular/fire/firestore";
import {Observable, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SalaDeChatService {

  constructor(
    private firestore: Firestore,
  ) { }

  // Return an observable that emits the messages in real-time
  public traerMensajes(): Observable<any[]> {
    const col = collection(this.firestore, 'sala-de-chat');
    const q = query(col, orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }); // Observable of messages
  }
}
