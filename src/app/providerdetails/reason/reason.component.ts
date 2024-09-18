import { Component } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrl: './reason.component.css'
})
export class ReasonComponent {
  reason:string=''
  constructor(private readonly orderService:OrdersService,
              private readonly router:Router,
  ){

  }
  cancel(){
    console.log(this.reason);
       
    const order={
      orderHistoryId:'',
      providerId:'',
      reason:this.reason
    }
    this.orderService.cancelBooking(order).subscribe({
      next:(response)=>{
        console.log(response);
        alert('Order was cancelled sucessfully')
        this.router.navigate(['home'])
      },error:(err:HttpErrorResponse)=>{
        alert(err.error.message);
        console.log(err.error.message);
      }
    })
  }
}
