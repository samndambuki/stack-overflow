import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuestionService } from '../../services/question-service';
import { Question } from '../../models/question';
import { Solution } from '../../models/solution';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-solutions',
  imports: [RouterModule,FormsModule,ReactiveFormsModule],
  templateUrl: './solutions.html',
  styleUrl: './solutions.scss'
})
export class Solutions implements OnInit {
  private questionService = inject(QuestionService);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  currentQuestion = signal<Question|null>(null);
  solutions = signal<Solution[]>([]);
  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  currentUser = signal<string>(this.userService.user()?.username || '');

  solutionForm = new FormGroup({
   solutionInput:new FormControl('',[Validators.required,Validators.minLength(3)]) 
  })

  ngOnInit() {
    const questionId = this.route.snapshot.params['questionId'];
    if (questionId) {
      this.loadQuestion(questionId);
    }
  }
  
  loadQuestion(questionId:string){
    this.isLoading.set(true);
    this.questionService.getQuestionById(questionId).subscribe({
      next:(question:Question)=>{
        this.currentQuestion.set(question);
        this.solutions.set(question.solutions || [])
        this.isLoading.set(false);
      },
      error:(error:any)=>{
        this.errorMessage.set('failed to load question');
        this.isLoading.set(false);
      }
    })
  }

  postSolution(){
    if(this.solutionForm.valid && this.currentQuestion()){
      this.isSubmitting.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const newSolution:Solution = {
        username: this.userService.user()?.username ??'',
        answer:this.solutionForm.value.solutionInput ?? '',
        upvotes:0,
        downvotes:0            
      }

      this.questionService.addSolution(this.currentQuestion()?.id!,newSolution).subscribe({
        next:(updatedQuestion:Question)=>{
          this.solutions.set(updatedQuestion.solutions || []);
          this.solutionForm.reset();
          this.successMessage.set('solution posted successfully');
          this.isSubmitting.set(false);
        },
        error:(error:any)=>{
          this.errorMessage.set('failed to post soltion. please try again');
          this.isSubmitting.set(false);

        }
      })

    }
  }

  upvoteSolution(solutionId: string) {
  if (this.currentQuestion()) {
    this.questionService.voteSolution(
      this.currentQuestion()!.id!, 
      solutionId, 
      'upvote', 
      this.currentUser()
    ).subscribe({
      next: (updatedQuestion: Question) => {
        this.solutions.set(updatedQuestion.solutions || []);
      },
      error: (error: any) => {
        console.error('Error voting on solution:', error);
      }
    });
  }
}

  downvoteSolution(solutionId: string) {
  if (this.currentQuestion()) {
    this.questionService.voteSolution(
      this.currentQuestion()!.id!, 
      solutionId, 
      'downvote', 
      this.currentUser()
    ).subscribe({
      next: (updatedQuestion: Question) => {
        this.solutions.set(updatedQuestion.solutions || []);
      },
      error: (error: any) => {
        console.error('Error voting on solution:', error);
      }
    });
  }
}

hasUserUpvoted(solution: Solution): boolean {
  return solution.voters?.[this.currentUser()] === 'upvote';
}

hasUserDownvoted(solution: Solution): boolean {
  return solution.voters?.[this.currentUser()] === 'downvote';
}

}
