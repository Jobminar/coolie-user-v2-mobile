import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FotterComponent } from '../fotter/fotter.component';
import { BookingsService } from '../services/bookings.service';
import { UserDetailsService } from '../services/user-details.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  @ViewChild('footer') footer!: FotterComponent;
  userName:string='';
  image:string='';
  whatsAppStaus='on';
  loading:boolean=false;
  constructor(private readonly location:Location,
              private readonly router:Router,
              private readonly authentication:AuthenticationService,
              private readonly bookingService:BookingsService,
              private readonly userDetailsService:UserDetailsService
  )
  {
    this.getAuthenticationDetails()
  }

  getAuthenticationDetails(){
    this.loading=true;
    this.authentication.getUser().subscribe(
      (response)=>{
        this.loading=false;
        console.log(response);
        if(response!==null){
            this.userDetailsService.userDetailsFromGoogle=response;
            // console.log(response.user.otp);
            this.userName=response.name;
            this.bookingService.name=response.name;
            this.bookingService.phoneNumber=response.phone;
            this.bookingService.image=response.image;
            this.image=response.image; 
            console.log(this.image);  
            // if (response.email===undefined) {
            //   const userConfirmed = confirm("Please verify your email");
            //   if (userConfirmed) {
            //     this.router.navigate(['editProfile'])
            //   } 
            // }
          }
      
      },(error)=>{
        this.loading=false;
        console.log(error);
      }
     )
  }
  options:any=[
    {
      icon:'location_on',
      name:'Saved Addresses'
    },
    {
      icon:'poker_chip',
      name:'My Rewards'
    },
    {
      icon:'local_activity',
      name:'Coupons'
    },
  
    {
      icon:'overview',
      name:'My bookings'
    },
    {
      icon:'featured_seasonal_and_gifts',
      name:'Invite a friend'
    },
    // {
    //   icon:'account_balance_wallet',
    //   name:'Wallet'
    // },
    
    {
      icon:'info',
      name:"About coolie No 1"
    },
    {
      icon:'policy',
      name:"Policies"
    },
    {
      icon:'question_mark',
      name:"Help center"
    },
    {
      icon:'logout',
      name:"Log Out"
    },
  ]

  policies:any=[
    {name:'Terms and conditions'},
    {name:'Refund policy'},
    {name:'Cancellation policy'},
    {name:'Privacy policy'}
  ]
  navTo(cat: string): void {
    console.log(cat);
    if (cat==='Policies') {
      this.showPolicy=!this.showPolicy;
    }
    switch(cat) {
      case 'Saved Addresses':
        this.router.navigate(['address']);
        break;
      case 'My Rewards':
        this.router.navigate(['rewards']);
        break;
      case 'Coupons':
        console.log('inside');
        this.router.navigate(['coupons']);
        break;
      case 'My bookings':
        this.router.navigate(['bookingHistory']);
        break;
      case 'Invite a friend':
        this.router.navigate(['invite']);
        break;
      case 'Wallet':
        this.router.navigate(['wallet']);
        break;
     
        case 'About coolie No 1':
        this.router.navigate(['about']);
        break;
        case 'Log Out':
        this.logout()
        break;
        case 'Help center':
        this.router.navigate(['help']);
        break;
      default:
        console.log('No matching case found');
    }
  }
  
  showPolicy:boolean=false;
  openPolicies(item:any){
    console.log("policies",item);
    if (item==='Policies') {
      this.showPolicy=!this.showPolicy
     
    }
  }

  logout(){
    localStorage.removeItem('userId');
    this.router.navigate(['auth']);
  }

  navBack(){
    this.location.back()
  }

  
  navToEditProfile(){
    this.router.navigate(['editProfile']);
  }
  statusChange(){
    if (this.whatsAppStaus==='on') {
      this.whatsAppStaus='off';
    }
    else if ( this.whatsAppStaus='off') {
      this.whatsAppStaus='on';
    } 
    
  }

}
