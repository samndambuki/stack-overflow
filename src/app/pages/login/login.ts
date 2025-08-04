import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm = new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(6)])
  })

  private userService  = inject(UserService);
  private router = inject(Router);

  submissionsStatus = signal<string|null>(null);

  login(){
    if(this.loginForm.valid){
      const {email,password} = this.loginForm.value;
      this.userService.getUser(email ?? '').subscribe(
        {
          next:(users)=>{
          const user = users.find(u=>u.password === password);
          if(user){
            this.userService.setUser(user);
            localStorage.setItem('user',JSON.stringify(user));
            this.submissionsStatus.set('login successful');
            this.router.navigate(['home']);
          }else{
            this.submissionsStatus.set('Invalid email or password');
          }
          },
          error:(error)=>{
            this.submissionsStatus.set('Error logging in');
          }
        }
      )
    }else{
      this.submissionsStatus.set('please fix form errors');
    }
  }
}
