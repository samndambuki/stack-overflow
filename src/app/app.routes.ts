import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { CreateAccount } from './pages/create-account/create-account';
import { Home } from './pages/home/home';
import { Solutions } from './pages/solutions/solutions';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:Login},
    {path:'create-account',component:CreateAccount},
    {path:'home',component:Home},
    {path:'view-solutions/:questionId',component:Solutions}
];
