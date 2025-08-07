import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Question } from '../models/question';
import { Solution } from '../models/solution';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  private generateSolutionId(): string {
  return 's' + Math.random().toString(36).substr(2, 9);
}
  
  postQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions`, question);
  }
  
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions`);
  }

  getQuestionById(id:string):Observable<Question>{
    return this.http.get<Question>(`${this.baseUrl}/questions/${id}`)
  }

addSolution(questionId: string, solution: Solution): Observable<Question> {
  return this.http.get<Question>(`${this.baseUrl}/questions/${questionId}`).pipe(
    switchMap(question => {
      const updatedSolutions = [...(question.solutions || []), { 
        ...solution, 
        id: this.generateSolutionId()
      }];
      return this.http.patch<Question>(`${this.baseUrl}/questions/${questionId}`, {
        solutions: updatedSolutions
      });
    })
  );
}

voteSolution(questionId: string, solutionId: string, voteType: 'upvote' | 'downvote', currentUser: string): Observable<Question> {
  return this.http.get<Question>(`${this.baseUrl}/questions/${questionId}`).pipe(
    switchMap(question => {
      const updatedSolutions = question.solutions?.map(solution => {
        if (solution.id === solutionId) {
          const voters = solution.voters || {};
          const currentVote = voters[currentUser];
        
          if (!currentVote) {
            voters[currentUser] = voteType;
            return {
              ...solution,
              upvotes: voteType === 'upvote' ? solution.upvotes + 1 : solution.upvotes,
              downvotes: voteType === 'downvote' ? solution.downvotes + 1 : solution.downvotes,
              voters
            };
          }
          
          if (currentVote === voteType) {
            delete voters[currentUser];
            return {
              ...solution,
              upvotes: voteType === 'upvote' ? solution.upvotes - 1 : solution.upvotes,
              downvotes: voteType === 'downvote' ? solution.downvotes - 1 : solution.downvotes,
              voters
            };
          }
        
          voters[currentUser] = voteType;
          return {
            ...solution,
            upvotes: voteType === 'upvote' ? solution.upvotes + 1 : solution.upvotes - 1,
            downvotes: voteType === 'downvote' ? solution.downvotes + 1 : solution.downvotes - 1,
            voters
          };
        }
        return solution;
      });
      
      return this.http.patch<Question>(`${this.baseUrl}/questions/${questionId}`, {
        solutions: updatedSolutions
      });
    })
  );
}

}
