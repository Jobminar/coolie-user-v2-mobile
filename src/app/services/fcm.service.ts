import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Capacitor } from '@capacitor/core';
import { PushNotification, PushNotificationActionPerformed, PushNotifications, Token } from '@capacitor/push-notifications';
import { ToastrsService } from './toastrs.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  token: string | null = null;

  constructor(private afMessaging: AngularFireMessaging,
    private readonly http:HttpClient,
    private readonly router:Router,
    private readonly toasterService:ToastrsService) {}

  requestPermission() {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();

          PushNotifications.addListener('registration', (token: Token) => {
            console.log('Push registration success, token: ' + token.value);
            this.token = token.value;
            this.saveToken(token.value);
          });

          PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
            console.log('Push received: ', notification);
          });

          PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
            console.log('Push action performed: ', notification);
            this.handlingClickEvent(notification.notification.data)
          });
        }
      });
    } else {
      this.afMessaging.requestToken.subscribe({
        next: (token:any) => {
          console.log('FCM token:', token);
          this.token = token;
          this.saveToken(token);
        },
        error: error => {
          console.error('Error getting token', error);
        }
      });
    }
  }

  receiveMessage() {
    this.afMessaging.messages.subscribe(payload => {
      console.log('Message received: ', payload);

      alert("notification recevied")
    });
  }

  private saveToken(token: string) {
    
    const api='https://api.coolieno1.in/v1.0/users/user-token';
    const headers= new HttpHeaders({
      'Content-Type': 'application/json'
    })
    const requestBody={
      userId:localStorage.getItem('userId'),
      token:token
    }
    alert(requestBody.userId);
    this.http.post(api,requestBody,{headers}).subscribe({
      next:(res)=>{
        alert(token);
        console.log(res);
        alert("token send sucessfully")
        // this.toasterService.showSuccess("token send sucessfully","Token")
      },error:(err)=>{
        console.log(err);
      }
    })
    
  }

  handlingClickEvent(data:any){
    if (data && data.route) {
      // Use the 'route' data from the notification to navigate to a specific path
      this.router.navigate(['home']).then(() => {
        console.log('Navigated to:', data.route);
      });
    } else {
      // Default navigation if no specific route is provided
      this.router.navigate(['/notifications']).then(() => {
        console.log('Navigated to notifications page');
      });
    }
  }
}
