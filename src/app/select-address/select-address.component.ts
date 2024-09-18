import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { UserDetailsService } from '../services/user-details.service';
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { MapboxService } from '../services/mapbox.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrl: './select-address.component.css',
})
export class SelectAddressComponent implements OnInit{

  name:any='';
  addressDefault: any;
  address: any[] = [];
  showAddres: boolean = false;
  selectedAddress:any[]=[];
  formattedAddresMp:string='';
  constructor(
    private readonly router: Router,
    private readonly servicesService: ServiceService,
    private readonly userDetailsService: UserDetailsService,
    private readonly orderService:OrdersService,
    private readonly mapBoxservice:MapboxService
  ) {
   
   
  }

  ngOnInit(): void {
 
    this.formattedAddresMp=this.mapBoxservice.locationFromComponent;
    console.log("formated in add",this.formattedAddresMp);
   
    console.log(this.userDetailsService.fullAddress);
    
      this.getAddress();
  
      this.getSelectedAdd();
    
   
  }
  // getting address

  getAddress() {
    this.userDetailsService.getAddress().subscribe({
      next: (response) => {
        console.log(response);
       console.log(this.userDetailsService.getSelectedAddress());
        if (this.userDetailsService.getSelectedAddress().length===0) {
          if (response.length===0) {
              this.name = 'Current Location';  // Label to indicate it's the current location
              this.addressDefault = this.formattedAddresMp;
              return ;
           }
           if (response.length>0) {
              this.userDetailsService.pincode=response[0].pincode;
              this.userDetailsService.formatingAddress(response);
              // if(this.name==='' || this.addressDefault==undefined || !this.name){
              //   this.name = this.userDetailsService.fullAddress[0].name;
              //   this.addressDefault = this.userDetailsService.fullAddress[0].address;
              // }
             console.log(this.userDetailsService.fullAddress);
              this.name = this.userDetailsService.fullAddress[0].name;
              this.addressDefault = this.userDetailsService.fullAddress[0].address;
              this.setPinAnddist(response)
           }
        }
       
         
      
      },
      error: (err:HttpErrorResponse) => {
        this.name='';
        
        console.log(err.error.message);
      },
    });
  }

  setPinAnddist(data:any){
    if (this.userDetailsService.categoryFilPincode==="" && this.userDetailsService.categoryFilDist==="" ) {
     
      this.userDetailsService.getCatFillDetails(data[0].pincode,data[0].city);
    }
   console.log(this.userDetailsService.setCatFillDetails());
  }

  getSelectedAdd()
  {
    console.log("selected",this.userDetailsService.getSelectedAddress());
    const selectedAddress = this.userDetailsService.getSelectedAddress();
    console.log(selectedAddress);
    
      this.name = selectedAddress[0].name;
      this.addressDefault = selectedAddress[0].address;
    
  }
  // assiging address which is selected


  addresses() {
    this.router.navigate(['address']);
    // this.showAddres = !this.showAddres;
    // this.address = this.userDetailsService.fullAddress;
    // console.log(this.address);
  }

  // assign the address

  selectAddress(index: number) {
    this.name = this.address[index].name;
    this.addressDefault = this.address[index].address;
    this.showAddres = false;
    console.log(this.userDetailsService.fullAddress[index]);
    this.orderService.setAddressId(this.address[index].id)
    // this.userDetailsService.selectedAddress=this.userDetailsService.fullAddress[index];
    this.userDetailsService.setSelectedAddress(this.address[index]);
  }
  navToAddAddress(){
    this.router.navigate(['address']);
  }
  
}
