import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BookingsService } from '../services/bookings.service';
import { FotterComponent } from '../fotter/fotter.component';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent {
  @ViewChild('footer') footer!: FotterComponent;
  navToBack(){
    this.location.back()
  }
  constructor(private readonly location:Location,
              private readonly bookingService:BookingsService,
              private readonly router:Router
  ){
    this.getBookingHistory();
  }
  public jobs:any[]=[]

  getBookingHistory(){
    this.bookingService.getBookingHistory().subscribe({
      next:(response)=>{
        console.log(response);
        // this.jobs=response;
        this.addingTotalAmount(response);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  selectedJob(item:any){
    console.log(item);
    this.bookingService.selectedJobDetails(item);
    this.router.navigate(['bookingDetails'])
  }

  addingTotalAmount(history:any[]){
    history.forEach((entry: any) => {
      let totalAmount = 0; // Initialize totalAmount outside the inner loop
    
      if (entry.items && Array.isArray(entry.items)) {
        entry.items.forEach((item: any) => {
          // Check if serviceVariants array exists and has at least one element
          if (item.serviceId && item.serviceId.serviceVariants && item.serviceId.serviceVariants.length > 0) {
            totalAmount += item.serviceId.serviceVariants[0].price * item.quantity;
          }
        });
      } else {
        console.error("No items found for entry:", entry);
      }
      entry.totalAmount = totalAmount;
      // console.log(totalAmount);
       // Output the calculated total amount for the current entry
    });
    
      this.jobs=history
      console.log(this.jobs);
  }
}
