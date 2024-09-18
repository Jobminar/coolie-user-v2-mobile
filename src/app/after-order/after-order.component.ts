import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-after-order',
  templateUrl: './after-order.component.html',
  styleUrl: './after-order.component.css'
})
export class AfterOrderComponent {

  constructor(private readonly router:Router){
    setTimeout(()=>{
      this.router.navigate(['provider/trackProvider'])
    })
  }

  navTo(){
    this.router.navigate(['home'])
  }
}
