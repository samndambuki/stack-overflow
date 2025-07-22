import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-account',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss'
})
export class CreateAccount {
createAccountForm = new FormGroup({
email:new FormControl('',[Validators.required,Validators.email]),
username:new FormControl('',[Validators.required,Validators.maxLength(12)]),
password:new FormControl('',[Validators.required,Validators.minLength(6)]),
})
}
