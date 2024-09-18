import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyCartService {

  constructor(private readonly http:HttpClient,
              private readonly authenticationService:AuthenticationService
  ) { }

  userId=localStorage.getItem('userId');


  addToCart(userId:string,item:any){
    console.log(this.authenticationService.userDetails);
    console.log(item);
    const api='https://api.coolieno1.in/v1.0/users/cart/create-cart';
    const headers=new Headers({

    })
    const items:any=item;
    const requestBody={
      userId:userId,
      items:items
    }
  
    console.log(requestBody);
    return this.http.post<any>(api,requestBody);
  }

  getCartItems(userId: any):Observable<any>{
    const api=`https://api.coolieno1.in/v1.0/users/cart/${userId}`;
    return this.http.get<any>(api);
  }

  delete(id:any):Observable<any>{
    const userId=localStorage.getItem('userId')
    const api=`https://api.coolieno1.in/v1.0/users/cart/${userId}/${id}`;
    return this.http.delete<any>(api)
  }

  getingLength(): Observable<number> {
    return this.getCartItems(this.userId).pipe(
      map(response => response[0]?.items.length || 0), // Return length or 0 if response[0] is undefined
      catchError(err => {
        console.error(err);
        return of(0); // Return 0 in case of error
      })
    );
  }
}
