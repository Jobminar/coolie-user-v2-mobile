// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { AuthenticationService } from '../authentication.service';
// import { Location } from '@angular/common';
// import { UserDetailsService } from '../user-details.service';

// @Component({
//   selector: 'app-edit-profile',
//   templateUrl: './edit-profile.component.html',
//   styleUrl: './edit-profile.component.css'
// })
// export class EditProfileComponent {
//   @ViewChild('fileInput') fileInput!: ElementRef;
//   userDetails!:FormGroup
//   userFromGoogle:any;
//   profileImageUrl: string ='';
//   constructor(private fb:FormBuilder,
//               private authenticationService:AuthenticationService,
//               private location:Location,
//               private userDetailsService:UserDetailsService
//   )
//   {
//     this.userFromGoogle=this.userDetailsService.userDetailsFromGoogle
//     this.userDetails=this.fb.group({
//       name:'',
//       email:'',
//       image:'',

//       phone:''
//     })

//   }

//   async emailVerify(){
//   this.authenticationService.handleGoogleLogin();
//    await console.log(this.authenticationService.handleGoogleLogin());

//   }

//   navToBack(){
//     this.location.back();
//   }
//   triggerFileInput() {
//     console.log("click");
//     const fileInput = document.querySelector('#fileInput') as HTMLElement;
//     fileInput.click();
//   }

//   onFileSelected(event: Event) {
//     console.log("inside select");
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files[0]) {
//       const file = input.files[0];
//       const reader = new FileReader();

//       reader.onload = (e: any) => {
//         this.profileImageUrl = e.target.result;
//       };

//       reader.readAsDataURL(file);
//     }
//   }
// }

import { Location } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserDetailsService } from '../services/user-details.service';
import { BookingsService } from '../services/bookings.service';
import { DemoService } from '../services/demo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  loading:boolean=false;
  public userDetails!: FormGroup;
  image:string='';
  profileImageUrl: string = 'assets/icons/profile.png'; // Default image URL
  selectedFile: File | null = null;
  constructor(
    private fb: FormBuilder,
    private readonly afAuth: AngularFireAuth,
    private readonly location: Location,
    private readonly demoService:DemoService,
    private readonly userDetailsService: UserDetailsService,
    private readonly bookingService: BookingsService,
    private readonly router:Router
  ) {
    
  }

  ngOnInit(): void {
    this.image=this.bookingService.image;
    
    this.userDetails = this.fb.group({
      name: [''],
      email: [''],
      dob: [''],
      gender: [''],
      city: [''],
      phone: this.bookingService.phoneNumber,
    });
  }
  navToBack() {
    this.location.back();
  }

  async emailVerify() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    let details;
    try {
      const result: any = await this.afAuth.signInWithPopup(provider);
      console.log('Google login result:', result);
      console.log(result.user.multiFactor.user.email);
      const email = result.user.multiFactor.user.email;
      this.userDetails.patchValue({ email });
    } catch (error: any) {
      alert('some thing went wrong');
    }

    return details;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      console.log(this.profileImageUrl);
      reader.readAsDataURL(file);
    }
  }

  save() {
    this.loading=true;
    const formData = new FormData();
    try {
      if (!this.userDetails.valid) {
        throw new Error('Please enter valid details');
      }
      console.log(this.userDetails.value);
      formData.append('name', this.userDetails.get('name')!.value);
      formData.append('email', this.userDetails.get('email')!.value);
      // formData.append('phone', this.userDetails.get('phone')!.value);
      formData.append('phone', this.userDetails.get('phone')!.value);
      formData.append('gender', this.userDetails.get('gender')!.value);
      formData.append('dateOfBirth', this.userDetails.get('dob')!.value);
      formData.append('city', this.userDetails.get('city')!.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.userDetailsService.edit(formData).subscribe({
        next: (response) => {
          this.loading=false;
          this.demoService.openDialog('Profile updated sucessfully');
          this.router.navigate(['profile']);
          console.log(response);
        },
        error: (err:HttpErrorResponse) => {
          this.loading=false;
          this.demoService.openDialog(`${err.error.status} Some thing went wrong please try again later.`);
          console.log(err);
        },
      });
    } catch (error) {
      this.loading=false;
      alert(error);
    }
  }
}
