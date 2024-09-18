// import { Component, OnInit } from '@angular/core';
// import { MapboxService } from '../mapbox.service';
// import { HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-location',
//   templateUrl: './location.component.html',
//   styleUrl: './location.component.css'
// })



// export class LocationComponent implements OnInit{
//   showAddress:boolean=false;
//   formattedAddress:string='';
//   public coordination!:[number,number];
//   currentAddress:any = {
//     address: '',
//     area:'',
//     city: '',
//     dist:'',
//     state: '',
//     pincode: '',
//     country:'',
//     landmark:''
//   };;
//   constructor(private readonly mapBoxService:MapboxService,
//               private readonly router:Router
//   ){

//   }
//   address: string=''
//   city: string=''
//   landmark?: string | undefined;
//   state: string=''
//   pincode: string=''

//   ngOnInit(): void {
//       this.mapBoxService.initializeMap("mapContainer");
//       this.mapBoxService.currentLocation$.subscribe({
//         next: (location) => {
//           if (location) {
//             this.coordination = location;
//             console.log(this.coordination);
//             this.getLocationName(location);
//           } else {
//             console.error('Location is not available');
//             // this.router.navigate(['home']);
//           }
//         },
//         error: (err) => {
//           console.error('Error getting location:', err);
//         },
//       });
//       setTimeout(()=>{
//         this.navToHome()
//       },60000)
//   }

//   getLocationName(cordinated:any){
//     this.mapBoxService.getPlaceNameFromCoordinates(cordinated).subscribe({
//       next:(res)=>{
//         console.log(res);
//         this. parseAddressData(res)
//         console.log(res[0]);
//       },
//       error:(err:HttpErrorResponse)=>{
//         console.log(err);
//       }
//     })
//   }


//   parseAddressData(data: any) {
//     let addressData:any = {
//       address: '',
//       area:'',
//       city: '',
//       dist:'',
//       state: '',
//       pincode: '',
//       country:'',
//       landmark:''
//     };
  
//     // Iterate through each feature in the data
//     data.forEach((feature: any) => {
//       if (feature.place_type.includes('address')) {
//         addressData.address = feature.text;
//       }
  
//       feature.context?.map((contextItem: any) => {
//         if (contextItem.id.startsWith('locality')) {
//           addressData.area = contextItem.text;
//         }
//         else if (contextItem.id.startsWith('place')) {
//           addressData.city = contextItem.text;
//         } 
//         else if (contextItem.id.startsWith('district')) {
//           addressData.dist = contextItem.text;
//         }  else if (contextItem.id.startsWith('region')) {
//           addressData.state = contextItem.text;
//         } else if (contextItem.id.startsWith('country')) {
//           addressData.country = contextItem.text;
//         } else if (contextItem.id.startsWith('postcode')) {
//           addressData.pincode = contextItem.text;
//         }
//         else if (contextItem.id.startsWith('neighborhood')) {
//           addressData.landmark = contextItem.text;
//         }
//       });
//     });
//   console.log(addressData);
//   this.showAddress=true;
//   this.currentAddress=addressData;
//   this.formatingAddress();
//   this.navToHome();
//     return addressData;
//   }

//   formatingAddress(){
//     this.formattedAddress=this.currentAddress.landmark +"," +this.currentAddress.area +","+ 
//         this.currentAddress.dist + ","+ this.currentAddress.city +','+ this.currentAddress.state + ","+ this.currentAddress.country +','+ this.currentAddress.pincode
//   this.mapBoxService.locationFromComponent=this.formattedAddress
//   }
// navToHome(){
 
//   setTimeout(()=>{
//     this.router.navigate(['home']);
//   },8000)
  
// }

// }


import { Component, OnInit } from '@angular/core';
import { MapboxService } from '../services/mapbox.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { GoogleMapService } from '../services/google-map.service';
import { UserDetailsService } from '../services/user-details.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})

export class LocationComponent implements OnInit {
  showAddress: boolean = false;
  formattedAddress: string = '';
  isLoading: boolean = true; // To show loader
  show:boolean=false;
  constructor(
    private readonly mapBoxService: MapboxService,
    private readonly router: Router,
    private readonly userDetailsService:UserDetailsService,
    private readonly googleMapService:GoogleMapService
  ) {}

  ngOnInit(): void {
    // Get the user's location
    this.googleMapService.getCurrentLocation().subscribe({
      next: (res) => {
        this.show=true;
        this.isLoading = false;
        this.showAddress = true; // Set to true when the location is fetched
        this.getLocationName(res);
      },
      error: (err) => {
        this.show=false;
        this.isLoading = false;
        console.log(err);
      }
    });
  }

  getLocationName(coordinates: any) {
    this.googleMapService.getPlaceName(coordinates).subscribe({
      next: (res) => {
        this.show=true;
        console.log('show:', this.show);
        this.formattedAddress = res.formatted_address;
        this.mapBoxService.locationFromComponent = this.formattedAddress;
        this.navToHome();
      },
      error: (err: HttpErrorResponse) => {
        this.show=false;
        console.error('Error fetching place name:', err);
      }
    });
  }

  navToHome() {
    setTimeout(() => {
      this.router.navigate(['home']);
    }, 5000); // Delay before navigating to home
  }}
