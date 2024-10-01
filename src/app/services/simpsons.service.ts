import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimpsonsService {
  private apiUrl = 'https://apisimpsons.fly.dev/api/personajes?limit=676&page=1';

  constructor(
    private http: HttpClient
  ) { }

  // Fetch all characters
  getAllCharacters(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
