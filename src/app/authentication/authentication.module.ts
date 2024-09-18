import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LogInComponent } from './log-in/log-in.component';
import { RouterModule, Routes } from '@angular/router';
import { VerifyOTPComponent } from './verify-otp/verify-otp.component';
import { HomeComponent } from '../home/home.component';
import { NgxLoadingModule } from "ngx-loading";

const routes: Routes = [
  {path:'',component:LogInComponent},
  {path:'logIn',component:LogInComponent},
  {path:'verifyOTP',component:VerifyOTPComponent},
  // {path:'home',component:HomeComponent}
];
@NgModule({
  declarations: [
    LogInComponent,
    VerifyOTPComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule ,
    NgxLoadingModule.forRoot({})
  ]
})
export class AuthenticationModule { }
