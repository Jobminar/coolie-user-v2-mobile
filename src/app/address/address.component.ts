import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MapboxService } from '../services/mapbox.service';
import { ToastrsService } from '../services/toastrs.service';
import { Subscription } from 'rxjs';
import { UserDetailsService } from '../services/user-details.service';
import { OrdersService } from '../services/orders.service';
import { DemoService } from '../services/demo.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {

  loading:boolean=false;
  private apiSubscription!: Subscription;
 private responseAddress:any;
 address:any[]=[]
  constructor(private readonly location:Location,
              private readonly router:Router,
              private readonly http:HttpClient,
              private readonly demoServices:DemoService,
              private readonly orderService:OrdersService,
              private readonly userDetailsService:UserDetailsService,
              private readonly mapBoxService:MapboxService,
              private readonly toasterService:ToastrsService
  ){
    this.mapBoxService.initializeMap('mapContainer');
    this.getAddress();
  }
  navToBack(){
    this.location.back();
  }

   
  getAddress(){
    
    this.loading=true;
    const userId=localStorage.getItem('userId')
    const api=`https://api.coolieno1.in/v1.0/users/user-address/${userId}`
   this.apiSubscription=this.http.get<any>(api).subscribe(
      (response)=>{
        this.loading=false;
        console.log(response);
        this.responseAddress=response;
        if (response ) {
          response.map((element: any) => {
            const add = element.address + ', ' + element.landmark + ', ' + element.city + ', ' + element.state + ', ' + element.pincode;
            this.address.push({add});
          });
        } else {
          this.loading=false;
          
          console.error('Response array is undefined or null');
        }
        console.log(this.address);
      },(err:HttpErrorResponse)=>{
        this.demoServices.openDialog(err.error.message)
        console.log(err.message);
        this.loading=false;
      },
      ()=>{
        this.apiSubscription.unsubscribe()
      }

    )
  }
  navToAddAddress(){
    this.router.navigate(['addAddress']);
  }
  deleteAddress(index:any){
    // this.toasterService.showSuccess('address deleted sucessfully', '')
    console.log(this.responseAddress[index]._id);
    const id=this.responseAddress[index]._id
    const api=`https://api.coolieno1.in/v1.0/users/user-address/${id}`;
    this.http.delete(api).subscribe({
      next:(response)=>{
        console.log(response);
        this.demoServices.openDialog('Address deleted sucessfully');
        this.address=[];
        this.getAddress();
      },
      error:(err)=>{
        console.log(err);
        this.demoServices.openDialog('Something went wrong, Please try again');
      }
    })
  }

  selectAddress(index: number) {
    // this.name = this.address[index].name;
    // this.addressDefault = this.address[index].address;
    // this.showAddres = false;
    // console.log(this.userDetailsService.fullAddress[index]);
    // console.log(this.responseAddress[index]);
    this.setPinAndDist(index);
    this.userDetailsService.pincode=this.responseAddress[index].pincode;
    // console.log(this.userDetailsService.pincode);
    this.orderService.setAddressId(this.responseAddress[index]._id);
    this.userDetailsService.formatingAddress(this.responseAddress[index]);
    this.userDetailsService.selectedAddress=this.userDetailsService.fullAddress[index];
    this.userDetailsService.setSelectedAddress(this.responseAddress[index]);

    // localStorage.setItem('selectedAddress', JSON.stringify(address));
    this.demoServices.openDialog('address selected')
    this.location.back();
  }

  // setting the pincode and dist
  setPinAndDist(index:number){
    const pincode=this.responseAddress[index].pincode
    const dist=this.responseAddress[index].city
    this.userDetailsService.getCatFillDetails(pincode,dist);
  }
}
