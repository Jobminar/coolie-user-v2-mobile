


import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UserDetailsService } from '../../services/user-details.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  loading:boolean=false;
  private apiSubscription!:Subscription;
  phoneNumber:any;
  private recaptchaVerifier: any;

  constructor(private fb: FormBuilder, 
    private readonly userServices:UserDetailsService,
    private readonly authService: AuthenticationService,
    private readonly router:Router) { }

  ngOnInit() {
   
  }
  // setupRecaptcha() {
  //   console.log("about to in");
  //   if (!this.recaptchaVerifier) {
  //     console.log("innnnnnnnnnnnnnn");
  //     this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  //       size: 'invisible',
  //       callback: (response: any) => {
  //         this.authService.handlePhoneLogin(this.phoneNumber);
  //       }
  //     });
  //   }
  // }
  getOtp() {
    this.loading=true;
    this.userServices.phoneNumber=this.phoneNumber;
    // this.authService.handlePhoneLogin(this.phoneNumber);
   this.apiSubscription= this.authService.getOtp(this.phoneNumber).subscribe(
      (response: any)=>{
        this.loading=false;
        console.log(response);
        this.authService.otp=response;
        this.router.navigate(['auth/verifyOTP']);
      },(error: HttpErrorResponse)=>{
        this.loading=false;
        console.log(error.message);
      },()=>{
        this.apiSubscription.unsubscribe();
      }
    )
  }

  googleSign() {
    this.authService.handleGoogleLogin();
  }
}
