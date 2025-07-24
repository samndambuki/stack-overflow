import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';
  public createAccount(userObj:User):Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/users`,userObj)
  }
}
