import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';

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

submissionStatus = signal<string|null>(null);

private userService = inject(UserService);

private router = inject(Router);

onSubmit(){
  if(this.createAccountForm.valid){
    this.submissionStatus.set('account created successfully')
  }else{
    this.submissionStatus.set('please fix form errors')
  }
}

createAccount(){
  const formValue = this.createAccountForm.value;
  const user:User = {
    email:formValue.email ?? '',
    username:formValue.username ?? '',
    password:formValue.password ?? ''
  }
  this.userService.createAccount(user).subscribe(
  (next:User)=>{
    console.log(next)
    this.router.navigate(['/home']);
  },
  (error)=>{
    console.log(error);
  })
}
}
