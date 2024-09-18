import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { FotterComponent } from '../fotter/fotter.component';
import { UserDetailsService } from '../services/user-details.service';
import { BookingsService } from '../services/bookings.service';
import { AuthenticationService } from '../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, of, Subscription } from 'rxjs';
import {Service,mostBookings,coreServices} from '../../models/allServicesModels'
import { FcmService } from '../services/fcm.service';
import { MyCartService } from '../services/my-cart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('footer') footer!: FotterComponent;
  private apiSuscription!:Subscription
  example: string = '';  // Initial value
  // What will be shown in the placeholder
  serviceEg: string[] = ['Air Conditioner', 'Kitchen', 'Salon', 'Home Cleaning'];
  currentIndex: number = 0;
  charIndex: number = 0;
  typingSpeed: number = 50; // Speed of typing (milliseconds)
  deletingSpeed: number = 50; // Speed of deleting (milliseconds)
  delayBetweenWords: number = 1000; // Delay before clearing the tex
  public service: Service[]=[];
  public mostBooked: mostBookings[]=[];
  // coreServices: coreServices[] = [];
  acAppliences:{id:string,name:string,price:number,image:string}[]=[]
  popularServices:{id:string,name:string,price:number,image:string}[]=[]
  albums: { _id: string; video: string ,image:string}[] = [];
  selectedVideoIndex: number | null = null;
  videoProgress: number[] = [];

  token:string|null="";
  loading:boolean=false;
  noOfItems:number=0;
  constructor(
    private readonly router: Router,
    private readonly servicesService: ServiceService,
    private readonly authentication: AuthenticationService,
    private readonly bookingService: BookingsService,
    private fcmService:FcmService,
    private readonly myCartService:MyCartService,
    private readonly userDetailsService: UserDetailsService
  ) {
    this.servicesService.getServicesOnLocation()
    // this.router.navigate(['auth'])
   
  }

  ngOnInit(): void {
   
    this.callingApis();
    this.getService();
    this.serviceExxample();
    // this.getMostBookedservices();
    this.getUser();
    this.getCount();
    // setTimeout(() => {
    //   this.getCoreService();
    // }, 1000);
    // this.getAcappliences();
    // this.getPopularServices();
    // this.getReels();
   
  }
  getCount(){
    this.myCartService.getingLength().subscribe(length => {
        // console.log(`Number of items in cart: ${length}`);
        this.noOfItems=length;
      });
  }
  // serviceExxample(){
  //   let currentIndex=0
  //   setInterval(() => {
  //     this.example = this.serviceEg[currentIndex];
  //     currentIndex = (currentIndex + 1) % this.serviceEg.length;
  //   }, 3000);

  // }
  serviceExxample() {
    // Start with the first example
    this.typeWriterEffect(this.serviceEg[this.currentIndex]);
  }

  typeWriterEffect(currentService: string): void {
    if (this.charIndex < currentService.length) {
      // Typing effect: add one character at a time
      this.example += currentService.charAt(this.charIndex);
      this.charIndex++;
      setTimeout(() => this.typeWriterEffect(currentService), this.typingSpeed);
    } else {
      // After typing is done, wait for a bit before clearing the text
      setTimeout(() => this.clearText(currentService), this.delayBetweenWords);
    }
  }

  clearText(currentService: string): void {
    if (this.charIndex > 0) {
      // Clearing effect: remove one character at a time
      this.example = currentService.substring(0, this.charIndex - 1);
      this.charIndex--;
      setTimeout(() => this.clearText(currentService), this.deletingSpeed);
    } else {
      // After clearing, move to the next word
      this.currentIndex = (this.currentIndex + 1) % this.serviceEg.length;
      this.typeWriterEffect(this.serviceEg[this.currentIndex]);
    }
  }
  public ads = [
    {
      src: '/assets/ads/ads.png',
    },
    {
      src: '/assets/ads/ads.png',
    },
    {
      src: '/assets/ads/ads.png',
    },
    {
      src: '/assets/ads/ads.png',
    },
  ];
  public covered: any = [
    {
      image: 'assets/demo/cutting.png',
      tittle: 'Expert haircut starting at Rs.199 ',
      description: 'Haircut at home',
      backgroundColor: '#0073C3',
    },
    {
      image: 'assets/demo/massage.png',
      tittle: 'Relax & rejuvenateat home',
      description: 'Massage for men',
      backgroundColor: '#8D9E2B',
    },
    {
      image: 'assets/demo/Rectangle 3395.png',
      tittle: 'Get experts in 2hours at Rs.149',
      description: 'Electricians, Plumbers, Carpenter',
      backgroundColor: '#0073C3',
    },
    {
      image: 'assets/home/bridal.png',
      tittle: 'Bridal makeup at your convenience',
      description: 'Bridal makeup services',
      backgroundColor: '#A62420',
    },
    {
      image: 'assets/home/garden.png',
      tittle: 'Beautiful garden all year around',
      description: 'Gardening services',
      backgroundColor: '#8D9E2B',
    },
    {
      image: 'assets/home/kitchen.png',
      tittle: 'Maintain your kitchen with ease',
      description: 'Kitchen maintenance service',
      backgroundColor: '#8D9E2B',
    },
  ];

  getService() {
    this.servicesService.getService().subscribe(
      (response:Service[]) => {
        // console.log(response);
        this.service = response;
        // this.service=this.servicesService.filteringService(response);
        // console.log("filtered",this.servicesService.filteringService(response));
      },
      (error) => {
        console.log(error);
      }
    );
  }
  selectedCategory(id: any, index: any) {
    this.servicesService.readyToGetSubCategory(id, index);
    this.router.navigate(['subServices']);
  }

  // getMostBookedservices() {
  //   this.servicesService.getMostBooked().subscribe((response:mostBookings[]) => {
  //     console.log("mostBookings",response);
  //     this.mostBooked = response;
  //   });
  // }

  // // get core service

  
  // getCoreService() {
  //   this.servicesService.getCoreService().subscribe({
  //     next: (response) => {
  //       console.log("coreServices",response);
  //       this.coreServices = response;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }


  // // getting appliences

  // getAcappliences(){
  //   this.servicesService.getAcAppliances().subscribe({
  //     next:(response)=>{
  //       console.log("appliences",response);
  //       this.acAppliences=response;
  //     },
  //     error:(err:HttpErrorResponse)=>{
  //       console.log(err);
  //     },
  //     complete:()=>{
  //       this.apiSuscription?.unsubscribe();
  //     }
  //   })
  // }

  // // getting popular services

  // getPopularServices(){
  //   this.servicesService.getPopularServices().subscribe({
  //     next:(response)=>{
  //       console.log("popular services",response);
  //       this.popularServices=response;
  //     },
  //     error:(err:HttpErrorResponse)=>{
  //       console.log(err);
  //     },
  //     complete:()=>{
  //       this.apiSuscription?.unsubscribe();
  //     }
  //   })
  // }
  // // getting reels
  // // Component Code
 

  // getReels() {
  //   this.servicesService.getReels().subscribe({
  //     next: (response) => {
  //       console.log(response);
  //       this.albums = response;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  callingApis(){
    this.loading=true;
   this.apiSuscription= forkJoin({
      mostBooked: this.servicesService.getMostBooked().pipe(
        catchError((err:HttpErrorResponse)=>{
          // console.log("error in mostBooked Service",err);
          return of([])
        })
      ),
      // coreservice:this.servicesService.getCoreService().pipe(
      //   catchError((err:HttpErrorResponse)=>{
      //     console.log(err);
      //     return of([])
      //   })
      // ),
      acAppliance:this.servicesService.getAcAppliances().pipe(
        catchError((err:HttpErrorResponse)=>{
          // console.log(err);
          return of([]);
        })
      ),
      popular:this.servicesService.getPopularServices().pipe(
        catchError((err:HttpErrorResponse)=>{
          // console.log("error in popular service",err);
          return of([]);
        })
      ),
      reels:this.servicesService.getReels().pipe(
        catchError((err:HttpErrorResponse)=>{
          // console.log("error in reels",err);
          return of([]);
        })
      )

    }).subscribe({
      
      next:(response)=>{
        this.loading=false;
        // console.log("calling",response);
        this.mostBooked = response.mostBooked;
        // this.coreServices = response.coreservice;
        this.acAppliences=response.acAppliance;
        this.popularServices=response.popular;
        this.albums = response.reels;
      },
      error:(err)=>{
        this.loading=false;
        // console.log(err);
      },
      complete:()=>{
        this.apiSuscription!.unsubscribe()
      }
    })
  }

  selectAlbum(videoIndex: number): void {
    this.selectedVideoIndex = videoIndex;
    this.videoProgress = Array(this.albums.length).fill(0);
  }

  get currentVideoUrl(): string | null {
    if (this.selectedVideoIndex !== null && this.albums.length !== 0) {
      // console.log(this.albums[this.selectedVideoIndex].video);  // Access 'video' property, not 'videoUrl'
      return this.albums[this.selectedVideoIndex].video;
    }
    return null;
  }

  playPreviousVideo(): void {
    if (this.selectedVideoIndex !== null && this.selectedVideoIndex > 0) {
      this.selectedVideoIndex--;
    } else {
      this.closeVideo();
    }
  }

  playNextVideo(): void {
    if (this.selectedVideoIndex !== null) {
      // Complete the progress of the current video before moving to the next one
      this.videoProgress[this.selectedVideoIndex] = 100;

      if (this.selectedVideoIndex < this.albums.length - 1) {
        this.selectedVideoIndex++;
      } else {
        this.closeVideo();
      }
    }
  }

  closeVideo(): void {
    this.selectedVideoIndex = null;
    this.videoProgress = [];
  }

  onVideoClick(event: MouseEvent): void {
   
    const videoElement = event.target as HTMLElement;
    const clickX = event.clientX;
    const videoWidth = videoElement.offsetWidth;

    if (clickX < videoWidth / 2) {
      this.playPreviousVideo();
    } else {
      this.playNextVideo();
    }
  }

  onTimeUpdate(event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    if (this.selectedVideoIndex !== null) {
      this.videoProgress[this.selectedVideoIndex] =
        (videoElement.currentTime / videoElement.duration) * 100;
    }
  }

  onVideoEnded(): void {
    this.playNextVideo(); // Automatically play the next video
  }

  getUser() {
    this.authentication.getUser().subscribe(
      (response) => {
        // console.log(response);
        this.userDetailsService.userDetailsFromGoogle = response;
        this.bookingService.name = response.displayName;
        this.bookingService.phoneNumber = response.phone;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // navigations starts from here------>
  navToMainService() {
    this.router.navigate(['mainService']);
  }
  navToCart(){
    this.router.navigate(['myCart']);
  }
}
