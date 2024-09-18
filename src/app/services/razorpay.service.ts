import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare var Razorpay: any;
@Injectable({
  providedIn: 'root'
})
export class RazorpayService {

  userId=localStorage.getItem('providerId');
  userCredit:number=0;
  constructor(private readonly http:HttpClient) { }

  payWithRazorpay(amount: number, orderId: string, currency: string): Observable<any> {
    return new Observable(observer => {
      const options = {
        key: 'rzp_test_b8XfUOQ4u8dlSq', // Replace with your Razorpay key
        amount: amount * 100, // amount in paise
        currency: currency,
        name: 'Coolie no.1', // your business name
        description: 'Test Transaction',
        image: 'assets/location/logo-v3 3.png',
        // order_id: "12121212", // This will be created from backend
  
        handler: (response: any) => {
          // handle payment success
          console.log(response);
          observer.next(response);
          observer.complete();
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Razorpay Corporate Office'
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            console.log('Checkout form closed');
            observer.error('Checkout form closed');
            observer.complete();
          },
          escape: false,
          backdropclose: false,
          handleback: true // Ensure full screen on mobile devices
        }
      };
  
      const rzp1 = new Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', function(response: any) {
        console.error(response.error);
        observer.error(response.error);
        observer.complete();
      });
    });
  }
  

}
