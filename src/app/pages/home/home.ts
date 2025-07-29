import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
question:string = '';
private questionService = inject(QuestionService);
post(){
  this.questionService.postQuestion(this.question).subscribe(
    (next)=>{},
    (error)=>{}
)
}
}
