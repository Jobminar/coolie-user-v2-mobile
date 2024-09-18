import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { Router } from '@angular/router';
import { FotterComponent } from '../fotter/fotter.component';
import { MyCartService } from '../services/my-cart.service';

@Component({
  selector: 'app-main-service',
  templateUrl: './main-service.component.html',
  styleUrl: './main-service.component.css'
})
export class MainServiceComponent implements OnInit{
  @ViewChild('footer') footer!: FotterComponent;
  services:any=[];
  loading:boolean=false;
  imageLink=""
  mostBooked:any;
  noOfItems:number=0;
  example:string='Home Cleaning';
  serviceEg:string[]=['Air Conditioner', 'Kitchen','Salon', 'Home cleaning'];
  covered:any=[
    {
      image:'assets/demo/cutting.png',
      tittle:'Expert haircut starting at Rs.199 ',
      description:'Haircut at home'
    },
    {
      image:'assets/demo/massage.png',
      tittle:'Relax & rejuvenateat home',
      description:'Massage for men'
    },{
      image:'assets/demo/Rectangle 3395.png',
      tittle:'Get experts in 2hours at Rs.149',
      description:'Electricians, Plumbers, Carpenter'
    }
  ]
  constructor(private readonly servicesService:ServiceService,
              private readonly router:Router,
              private readonly cartService:MyCartService
  ){
   
  }

  ngOnInit(): void {
    this.getService();
    this.getMostBookedservices();
    this.getExampleService();
    this.getCartCount();
  }

  getCartCount(){
    this.cartService.getingLength().subscribe(length => {
      console.log(`Number of items in cart: ${length}`);
      this.noOfItems=length;
    });
  }
  getExampleService(){
    let currentIndex=0
    setInterval(() => {
      this.example = this.serviceEg[currentIndex];
      currentIndex = (currentIndex + 1) % this.serviceEg.length;
    }, 3000);
  }
  getService(){
    this.loading=true;
    this.servicesService.getService().subscribe(
      (response)=>{
        this.loading=false;
        console.log(response);
        this.services=response;
        this.serviceResponse=this.services
      },(error)=>{
        this.loading=false;
        console.log(error)
      }
    )
  }
  getMostBookedservices(){
    this.servicesService.getMostBooked().subscribe(
      (response)=>{
        console.log(response);
        this.mostBooked=response;
      }
    )
  }
  selectedCategory(item:any,index:any){
    console.log(item, index);
    // this.servicesService.readyToGetSubCategory(item,index);
    this.servicesService.readyToGetSubCategory(item, index);
    this.router.navigate(['subServices'])
  }

  searchTerm:string='';
  private serviceResponse:any;
  search(event:any){
    
    let  filteredServices:any;
      console.log("inside");
      filteredServices = this.serviceResponse.filter((service: { name: string; }) =>
        service.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.services=filteredServices;
    
  }

  navToCart(){
    this.router.navigate(['myCart']);
  }
}
