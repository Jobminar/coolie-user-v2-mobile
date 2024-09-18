import { Component, OnInit } from '@angular/core';
import { FcmService } from './services/fcm.service';
import { Subscription } from 'rxjs';

import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'CoolieNo.1_User';
  token:string |null='';
  public apiSubscription!:Subscription
  constructor(private readonly fcmService:FcmService,
    private readonly location:Location,
    private readonly router:Router){
   
  }
ngOnInit(): void {
  
  // this.fcmService.requestPermission();
  // this.fcmService.receiveMessage();
  this.registerBackButtonListener();
  this.monitorNetworkStatus()
  
}
  registerBackButtonListener() {
    App['addListener']('backButton', (event: any) => {
      if (event.canGoBack) {
        // If there is a page to go back to, let the app handle it
        this.location.back();
        console.log('Back button pressed, navigating back');
      } else {
        // If there's no page to go back to, exit the app
        console.log('Back button pressed, exiting app');
        App['exitApp'](); // Close the app
      }
    });
  }
  async monitorNetworkStatus() {
    const status = await Network.getStatus();

    if (!status.connected) {
      this.router.navigate(['provider/notFound']); // Navigate to Not Found page if network is unavailable
    }

    Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        this.router.navigate(['provider/notFound']);
      }
      
    });
  }

}
