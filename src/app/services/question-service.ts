import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'https://localhost:3000';
  private http = inject(HttpClient);
  postQuestion(question:string){
    return this.http.post(`${this.baseUrl}/questions`,question)
  }
}
