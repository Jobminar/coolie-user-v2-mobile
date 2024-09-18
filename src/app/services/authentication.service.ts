// import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
//  // Adjust path to your Toastr service
// import { Router } from '@angular/router';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

// import { ToastrsService } from './toastrs.service';
// import { fireBaseCredential } from '../environment/firebaseCredentials';
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthenticationService {
//   phoneNumber: string = '';
//   otp: string = '';
//   verificationId: string = '';
//   recaptchaVerifier: firebase.auth.RecaptchaVerifier | undefined;

//   constructor(
//     private afAuth: AngularFireAuth,
//     private toastService: ToastrsService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     // Initialize Firebase
//     firebase.initializeApp(fireBaseCredential.fireBaseConfig);
//   }

//   setupRecaptcha() {
//     if (!this.recaptchaVerifier) {
//       this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
//         size: 'invisible',
//         callback: (response: any) => {
//           this.handlePhoneLogin(this.phoneNumber);
//         }
//       });
//     }
//   }

//   async handleGoogleLogin() {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     provider.setCustomParameters({
//       prompt: 'select_account'
//     });

//     try {
//       const result = await this.afAuth.signInWithPopup(provider);
//       console.log('Google login result:', result);
//       console.log('Logged in user details:', result.user);
//       this.toastService.showSuccess('Logged in with Google');
//       this.router.navigate(['/profile']);
//     } catch (error: any) {
//       this.toastService.showError(error.message);
//     }
//   }

//   async handlePhoneLogin(phoneNumber:any) {
//     this.phoneNumber=phoneNumber;
//     this.setupRecaptcha();
//     const appVerifier = this.recaptchaVerifier!;
//     try {
//       const number = `+91${this.phoneNumber}`;
//       const confirmationResult = await this.afAuth.signInWithPhoneNumber(number, appVerifier);
//       this.verificationId = confirmationResult.verificationId;
//       this.toastService.showSuccess('OTP sent to phone');
//       this.router.navigate(['verifyOTP'])
//     } catch (error: any) {
//       console.error('Error during phone login:', error);
//       this.toastService.showError(error.message);
//     }
//   }

//   async verifyOtp(otp:any) {
//     this.otp=otp;
//     const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.otp);
//     try {
//       const result = await this.afAuth.signInWithCredential(credential);
//       console.log('Phone login result:', result);
//       console.log('Logged in user details:', result.user);
//       this.toastService.showSuccess('Logged in with phone');
//       this.router.navigate(['/profile']);
//     } catch (error: any) {
//       console.error('Error during OTP verification:', error);
//       this.toastService.showError(error.message);
//     }
//   }

 
// }
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { ToastrsService } from './toastrs.service';
import { fireBaseCredential } from '../../environment/firebaseCredentials';
import { HttpClient } from '@angular/common/http';
import { DemoService } from './demo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  phoneNumber: string = '';
  otp:any;
  verificationId: string = '';
  
  recaptchaVerifier: firebase.auth.RecaptchaVerifier | undefined;

  constructor(
    private afAuth: AngularFireAuth,
    // private readonly toastServic:ToastrsService,
    private readonly demoServices:DemoService,
    private readonly router: Router,
    private readonly http:HttpClient
  ) {
   
  }

  ngOnInit() {
    if (!firebase.apps.length) {
      firebase.initializeApp(fireBaseCredential.fireBaseConfig);
    }else{
      console.log("not connected");
  }
  }

  setupRecaptcha() {
    console.log("about to in");
    if (!this.recaptchaVerifier) {
      console.log("innnnnnnnnnnnnnn");
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          this.handlePhoneLogin(this.phoneNumber);
        }
      });
    }
  }

  userDetailsFromGoogle:any;
  async handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    let details;
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Google login result:', result);
      console.log('Logged in user details:', result.user);
      
      // this.sendGoogleSignIn(result.user)
      this.userDetailsFromGoogle=result.user;
      alert("please verify phone number");
     
      console.log(this.userDetailsFromGoogle.email);
      console.log(this.userDetailsFromGoogle.multiFactor.user);
     
     
      return  details=this.userDetailsFromGoogle.multiFactor.user;
     
    } catch (error: any) {
      this.demoServices.openDialog(error.error.message)
      // this.toastService.showError(error.message,"error");
    }

    return details;
  }

  async handlePhoneLogin(phoneNumber: any) {
    this.phoneNumber = phoneNumber;
    this.setupRecaptcha();
    const appVerifier = this.recaptchaVerifier!;
    console.log(appVerifier,"cap");
    try {
      const number = `+91${this.phoneNumber}`;
      const confirmationResult = await this.afAuth.signInWithPhoneNumber(number, appVerifier);
      this.verificationId = confirmationResult.verificationId;
      console.log('OTP sent to phone');
      this.demoServices.openDialog('OTP sent to phone number')
      // this.toastService.showSuccess('OTP sent to phone');
      this.router.navigate(['auth/verifyOTP']);
    } catch (error: any) {
      console.error('Error during phone login:', error);
      this.demoServices.openDialog(`${error.error.status} Some thing went wrong`);
      // this.toastService.showError(error.message);
    }
  }

  // async verifyOtp(otp: any) {
  //   this.otp = otp;
  //   const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.otp);
  //   try {
  //     const result = await this.afAuth.signInWithCredential(credential);
  //     console.log('Phone login result:', result);
  //     console.log('Logged in user details:', result.user);
  //     this.toastService.showSuccess('Logged in with phone');
  //     this.router.navigate(['/profile']);
  //   } catch (error: any) {
  //     console.error('Error during OTP verification:', error);
  //     this.toastService.showError(error.message);
  //   }
  // }

 
  getOtp(phone:any):any{
    console.log(this.userDetailsFromGoogle);
    this.phoneNumber=phone;
    const api='https://api.coolieno1.in/v1.0/users/userAuth/send-otp';
    const requestBody={
      phone:phone
    }
    return this.http.post(api,requestBody)
  }

  verifyOtp(otp:any){
    const api="https://api.coolieno1.in/v1.0/users/userAuth/login";
    console.log(this.userDetailsFromGoogle);
    let requestBody:any;
    if (!this.userDetailsFromGoogle) {
      requestBody={
        phone:this.phoneNumber,
        otp:otp
      }

    } else {
       requestBody={
        phone:this.phoneNumber,
        otp:otp,
        email:this.userDetailsFromGoogle.email,
       name:this.userDetailsFromGoogle.displayName,
        displayName:this.userDetailsFromGoogle.displayName,
        photoURL:this.userDetailsFromGoogle.photoURL,
        providerId:this.userDetailsFromGoogle.productId,
      }
    }
   
    console.log(requestBody);
    return this.http.post(api,requestBody)
  }

  // sendGoogleSignIn(user:any){
  //   const api=''
  //   const requestBody={
  //     email:'',
  //     name:'',
  //     displayName:'',
  //     photoURL:'',
  //     providerId:'',

  //   }
  //   return this.http.post(api,requestBody)
  // }

  userDetails:any;
  setToken(response:any){
    this.userDetails=response.user
    localStorage.setItem("token",response.token);
    localStorage.setItem("userId",response.user._id)
    this.router.navigate(['home']);
  }

  getFromLocalStorage():any{
    return localStorage.getItem('userId')
  }

  getUser(){
    const userId=localStorage.getItem('userId')
    const api=`https://api.coolieno1.in/v1.0/users/userAuth/${userId}`
    return this.http.get<any>(api)
  }
}
