import { Component, OnInit } from '@angular/core';
import { MapboxService } from '../../services/mapbox.service';
import { OrdersService } from '../../services/orders.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trackprovider',
  templateUrl: './trackprovider.component.html',
  styleUrl: './trackprovider.component.css'
})
export class TrackproviderComponent implements OnInit {

  constructor(private readonly mapBoxservice:MapboxService,
              private readonly router:Router,
              private readonly orderService:OrdersService
  ){

  }

  ngOnInit(): void {
      this.mapBoxservice.initializeMap('mapContainer')
  }
  isOverlayActive = false;

  toggleOverlay() {
    this.isOverlayActive = !this.isOverlayActive;

    const subContainer = document.querySelector('.sub-container');
    const mapContainer = document.getElementById('mapContainer');

    if (this.isOverlayActive) {
      subContainer?.classList.add('active');
      mapContainer?.classList.add('dimmed');
    } else {
      subContainer?.classList.remove('active');
      mapContainer?.classList.remove('dimmed');
    }
  }
  cancelBooking(){
     
    const order={
      orderHistoryId:'',
      providerId:'',
      reason:''
    }
    this.orderService.cancelBooking(order).subscribe({
      next:(response)=>{
        console.log(response);
      },error:(err:HttpErrorResponse)=>{
        console.log(err.error.message);
      }
    })
  }
  navToDialog(){
    this.router.navigate(['provider/reason'])
  }
 }
