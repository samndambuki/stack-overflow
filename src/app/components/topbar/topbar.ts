import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {
private router = inject(Router);
get isLoggedIn():boolean{
  return localStorage.getItem('user') !== null;
}
logout(){
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}
}
