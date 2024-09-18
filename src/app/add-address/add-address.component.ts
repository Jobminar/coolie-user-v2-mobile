import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapboxService } from '../services/mapbox.service';
import { BookingsService } from '../services/bookings.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { map, Observable, of, Subscription } from 'rxjs';
import { ToastrsService } from '../services/toastrs.service';
import { GoogleMapService } from '../services/google-map.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent implements OnInit, OnDestroy{
[x: string]: any;
  public loading = false; 
  public address!: FormGroup;
  public currentAddress!:FormGroup;
  // mobile:any;
  // name:any;
  private apiSubscription!: Subscription;
  coordinates: any = [];
    
  useCurentLocation:boolean=false;
  addressResponse:any;
  formatedCurrentAddress:any;
  navToBack(){
    this.location.back();
  }
  constructor(private fb: FormBuilder, 
    private readonly mapBoxService: MapboxService,
    private readonly bookingService:BookingsService,
    private readonly http:HttpClient,
    private readonly router:Router,
    private readonly location:Location,
    private readonly toasteServe:ToastrsService,
    private readonly googleMapService:GoogleMapService
  )
   { 
    // this.mapBoxService.initializeMap('mapContainer');
    // this.coordinates = this.mapBoxService.currentLocation;
    // this.getCurrentCoordinates();
    let codrs= {'lat':this.mapBoxService.currentLocation[0],'lng':this.mapBoxService.currentLocation[1]};
    this.coordinates=codrs;
   console.log(this.coordinates);
   }

   getCurrentCoordinates(){
    this.googleMapService.getCurrentLocation().subscribe({ 
      next:(res)=>{
        console.log(res);
        this.getCurrentPlaceName(res);
        this.coordinates.push(res?.lat,res?.lng)
      },
      error:(err)=>{
        console.log(err);
      }
    })
   }
   ngOnInit(): void {
    this.address=this.fb.group({
      userId:localStorage.getItem('userId'),
      username:'',
      bookingType:'self',
      mobileNumber:'',
      address:'',
      city:'',
      landmark:'',
      state:'',
      pincode:'',
      latitude:this.coordinates[1],
      longitude:this.coordinates[0]
    });


    this.currentAddress=this.fb.group({
      name:'',
      appartment:'',
      landmark:'',
      hno:'',
      address:''
     
    });
   }


 async getCurrentAddress() {
  //  this.mapBoxService.initializeMap('mapContainer');
  this.getCurrentCoordinates()
   
  }

  // getCurrentPlaceName(res: google.maps.LatLngLiteral | null) {
  //   this.loading=true;
  //   console.log(res);
  //   const geoCode= new google.maps.Geocoder();
  //   geoCode.geocode({ location:res},(results, status)=>{
  //     if (status === 'OK' && results && results.length > 0) {
  //       console.log(results);
  //       this.addressResponse=results;
  //       this.formatAddressData(results[0]);
  //       this.loading=false;
      
     
  //     } else {
  //       console.log('Geocoder failed due to: ' + status);
  //       this.loading=false;
  //       this.toasteServe.showError('failed to get current place','')
  //     }
  //   });
   
  
  //   // this.apiSubscription=this.mapBoxService.getPlaceNameFromCoordinates(this.coordinates).subscribe(
  //   //   (response) => {
  //   //     console.log(response);
  //   //     this.addressResponse=response;
  //   //     this.formatAddressData(response);
  //   //     this.loading=false;
  //   //     this.toasteServe.showError('failed to get current place','')
  //   //   },
  //   //   (err) => {
  //   //     console.error('Error fetching place name:', err);
  //   //     this.loading=false;
  //   //     this.toasteServe.showError('failed to get current place','')
  //   //   },() => {
  //   //     // Unsubscribe when the observable completes
  //   //     this.loading=false;
  //   //     this.apiSubscription.unsubscribe();
  //   //   }
  //   // );
    
  // }

  getCurrentPlaceName(res: google.maps.LatLngLiteral | null) {
    if (!res || !res.lat || !res.lng) {
      console.error('Invalid coordinates:', res);
      this.toasteServe.showError('Invalid coordinates', '');
      this.loading = false;
      return;
    }
  
    this.loading = true;
    console.log(res);
  this.coordinates=res;
    const geoCode = new google.maps.Geocoder();
  
    geoCode.geocode({ location: res }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        console.log(results);
        this.addressResponse = results;
        this.formatAddressData(results[0]);
        this.loading = false;
      } else {
        console.error('Geocoder failed due to:', status);
        this.loading = false;
        this.toasteServe.showError('Failed to get current place', '');
      }
    });
  }
  
  formatAddressData(data: any) {
    const formattedAddress = {
      address: '',
      city: '',
      landmark: '',
      state: '',
      pincode: '',
      appartment:'',
      
      hno:'',
    };
  
    // Use reduce to populate the formattedAddress based on place_type
    for (let i = 0; i < data.address_components.length; i++) {
      const contextItem = data.address_components[i];
  
      // Check for relevant types and populate formattedAddress
      if (contextItem.types.includes('sublocality_level_1')) {
        formattedAddress.landmark = contextItem.long_name;
      } else if (contextItem.types.includes('locality')) {
        formattedAddress.city = contextItem.long_name;
      } else if (contextItem.types.includes('administrative_area_level_1')) {
        formattedAddress.state = contextItem.long_name;
      } else if (contextItem.types.includes('postal_code')) {
        formattedAddress.pincode = contextItem.long_name;
      } else if (
        contextItem.types.includes('sublocality_level_2') ||
        contextItem.types.includes('administrative_area_level_3')
      ) {
        // Concatenate parts of the address
        formattedAddress.address += contextItem.long_name + ', ';
      }
      else if (contextItem.types.includes('sublocality_level_3')) {
        formattedAddress.appartment = contextItem.long_name;
      } else if (contextItem.types.includes('premise')) {
        formattedAddress.hno = contextItem.long_name;
      }
    }
  
  
    console.log(formattedAddress);
    this.formatedCurrentAddress=formattedAddress
    this.assignValues(data,formattedAddress)
  }


  assignValues(address:any,formattedAddress:any){
    this.useCurentLocation=!this.useCurentLocation;
    console.log(address,formattedAddress);
 
  this.currentAddress.patchValue({
    appartment:formattedAddress.appartment,
    landmark:formattedAddress.landmark,
    hno:formattedAddress.hno,
    address: formattedAddress.address
  });
  
  console.log(this.currentAddress.value);
  formattedAddress.username=this.currentAddress.value.name;
  this.formatedCurrentAddress=formattedAddress;
  console.log(this.formatedCurrentAddress);
  }

  submit(){
    console.log(this.address.value);
    this.saveAddress(this.address.value);
  }
  saveAddress(data:any){
    this.loading=true;
    console.log(this.bookingService.name,this.bookingService.phoneNumber);
    
    this.address.value.mobileNumber=this.bookingService.phoneNumber;
    

    const requestBody={
      userId:localStorage.getItem('userId'),
      username:data.username,
      bookingType:'self',
      mobileNumber:this.bookingService.phoneNumber,
      address:data.address,
      city:data.city,
      landmark:data.landmark,
      state:data.state,
      pincode:data.pincode,
      latitude:this.coordinates.lat,
      longitude:this.coordinates.lng
    };
    console.log(requestBody);
    const api='https://api.coolieno1.in/v1.0/users/user-address';
    this.http.post(api,requestBody).subscribe({
      next:(response: any)=>{
        console.log(response);
        alert("Address added sucessfully");
        this.router.navigate(['address']);
        this.loading=false;
      },
      error:(err: any)=>{
        console.log(err);
        this.loading=false;
        alert("some thing went wrong");
      },complete:()=>{
        this.loading=false;
        this.apiSubscription.unsubscribe();
      }
  })
  
  }
  saveCurrentAddress(){
    console.log(this.formatedCurrentAddress);
    this.assignValues(this.addressResponse,this.formatedCurrentAddress)
    this.saveAddress(this.formatedCurrentAddress)
  }
  navToMap(){
    this.router.navigate(['maps'])
  }

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }
}
