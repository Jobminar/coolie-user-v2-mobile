import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { DemoService } from '../services/demo.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrl: './coupon.component.css'
})
export class CouponComponent {
  constructor(private readonly location:Location,private demoService: DemoService){

  }
  navToBack(){
    this.location.back();
  }


  openDialog() {
    const icon = 'backarrow';
    const content = 'This is dynamic content for the dialog.';
    
    this.demoService.openDialog(content);
  }
}
