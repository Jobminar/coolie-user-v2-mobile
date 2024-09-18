import { Component } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {

  loading:boolean=false;
  orderDetails:any=[
    {
      name:'beauty and saloon',
      price:'12,999',
      time:'6:30 pm, 10 Apr'
    },
    {
      name:'beauty and saloon',
      price:'12,999',
      time:'6:30 pm, 10 Apr'
    }, {
      name:'beauty and saloon',
      price:'12,999',
      time:'6:30 pm, 10 Apr'
    },
    {
      name:'beauty and saloon',
      price:'12,999',
      time:'6:30 pm, 10 Apr'
    }
  ]
}
