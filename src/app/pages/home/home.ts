import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../services/question-service';
import { Question } from '../../models/question';
import { UserService } from '../../services/user-service';
import { catchError, of } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
questionsList = signal<Question[]>([]);
errorMessage = signal<string|null>(null);
isLoading = signal<boolean>(false);

ngOnInit(): void {
  this.questionService.getQuestions().subscribe({
    next:(questions)=>{
      this.questionsList.set(questions);
    }
  })
}

questionForm = new FormGroup({
  questionInput : new FormControl('',[Validators.required,Validators.minLength(3)])
})

private questionService = inject(QuestionService);
private userService = inject(UserService);


post(){
  if(this.questionForm.valid && this.userService.user()?.username){
    this.isLoading.set(true);
    const newQuestion:Question = {
      username:this.userService.user()?.username ?? '',
      question:this.questionForm.get('questionInput')?.value ?? '',
      solutions:[]
    }
    this.questionService.postQuestion(newQuestion).pipe(
      catchError((err)=>{
        this.errorMessage.set('Failed to post question')
        this.isLoading.set(false);
        console.error(err);
        return of(null);
      })
    ).subscribe(
      {
        next:(res)=>{
          if(res){
            this.questionsList.update(questions=>[...questions,res])
            this.questionForm.reset()
            this.errorMessage.set(null);
          }
          this.isLoading.set(false)
        }
      }
    )
  }else{
    this.errorMessage.set('Please enter a valid question')
  }
}

}
