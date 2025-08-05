import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-solutions',
  imports: [RouterModule],
  templateUrl: './solutions.html',
  styleUrl: './solutions.scss'
})
export class Solutions {
  solutionForm = new FormGroup({
   solutionInput:new FormControl('',[Validators.required,Validators.minLength(3)]) 
  })
}
