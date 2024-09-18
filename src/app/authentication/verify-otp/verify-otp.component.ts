import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { DemoService } from '../../services/demo.service';
import { UserDetailsService } from '../../services/user-details.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOTPComponent implements OnInit {
  @ViewChild('input1') input1!: ElementRef 
  @ViewChild('input2') input2!: ElementRef
  @ViewChild('input3') input3!: ElementRef 
  @ViewChild('input4') input4!: ElementRef 
  @ViewChild('input5') input5!: ElementRef 
  @ViewChild('input6') input6!: ElementRef 
  public otp!: FormGroup;
  loading:boolean=false;
   number:number=0;
  constructor(private readonly form: FormBuilder,
              private readonly authService:AuthenticationService,
              private readonly router:Router,
              private readonly userService:UserDetailsService,
              private readonly demoService:DemoService
              ) { 
    
  }

  ngOnInit(): void {
    this.number=this.userService.phoneNumber;
    this.otp = this.form.group({
      inputOne: '',
      inputTwo: '',
      inputThree: '',
      inputFour: '',
       inputFive: '',
        inputSix: ''
    });
      this.getOtp();
  }

  onInput(event: any, position: number) {
    const inputValue = event.target.value;
    if (inputValue.length === 1) {
      switch (position) {
        case 1:
          this.input2.nativeElement.focus();
          break;
        case 2:
          this.input3.nativeElement.focus();
          break;
        case 3:
          this.input4.nativeElement.focus();
          break;
        case 4:
          this.input5.nativeElement.focus();
          break;
        case 5:
          this.input6.nativeElement.focus();
          break;
        case 6:
          break;
        default:
          break;
      }
    }
  }

  // backspace of input

  onKeyDown(event:KeyboardEvent,currentinput:number){
    const input = event.target as HTMLInputElement;
    if(event.key=== 'Backspace' && !input.value && currentinput>1){
      const previousInputIndex=currentinput-1;
      console.log(previousInputIndex);
      if (previousInputIndex) {
       switch (previousInputIndex){
        case 5: this.input5.nativeElement.focus();
        break;
        case 4: this.input4.nativeElement.focus();
        break;
        case 3: this.input3.nativeElement.focus();
        break;
        case 2: this.input2.nativeElement.focus();
        break;
        case 1 : this.input1.nativeElement.focus();
        break;
        
       }
      }
    }
  }
  getOtp(){
    setTimeout(()=>{
      alert(this.authService.otp.otp);
    },7000)
    
  }
  login() {
    this.loading=true;
    const enterOtp=this.otp.value.inputOne+this.otp.value.inputTwo+this.otp.value.inputThree+this.otp.value.inputFour+this.otp.value.inputFive+this.otp.value.inputSix
    const intOtp = parseInt(enterOtp, 10);
    console.log(intOtp);
   this.authService.verifyOtp(intOtp).subscribe(
    (response:any)=>{
      this.loading=false;
      console.log(response.token);
      this.setToken(response)
      this.demoService.openDialog('You are logged In')
      this.router.navigate(['home']);
    },(error)=>{
      this.loading=false;
      console.log(error);
    }
   )
  
  }

 setToken(token:string){
  this.authService.setToken(token)
 }
 
}
