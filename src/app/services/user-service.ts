import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  // public user:User | null= null;
  private baseUrl = 'http://localhost:3000';
  createAccount(userObj:User):Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/users`,userObj)
  }
  getUser(email:string):Observable<User[]>{
    const params = new HttpParams().set('email',email);
    return this.http.get<User[]>(`${this.baseUrl}/users`,{params})
  }
}
