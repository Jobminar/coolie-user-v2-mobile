import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../services/bookings.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css'
})
export class BookingDetailsComponent implements OnInit{
 
  loading:boolean=false;
  constructor(private readonly bookingService:BookingsService,
              private readonly location:Location,
              private readonly router:Router
  )
  {
   
  }
  ngOnInit(): void {
    this.bookingService.getSelectedJob()
    
    this.jobDetails.push(this.bookingService.selectedJob);
    console.log( this.jobDetails);
  }
  public jobDetails:any=[];
  noJobs:any=[
    {
     jobs:[{
              name:'Facial and skin care',
              count:'1',
              amount:'799'
            },
            {
              name:'Hand & Foot care',
              count:'1',
              amount:'699'
            },
          ],
     others:'69',
     total:'1574',
     credit:'7',
    }
  ]
  navToBack(){
    this.location.back();
  }
  navToHelp(){
    this.router.navigate(['help'])
  }
}
