import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Network } from '@capacitor/network';
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  constructor(private readonly loaction:Location){

  }
  async retry(){
    const network= await Network.getStatus()
    if (network) {
      this.loaction.back();
    }
  }
}
