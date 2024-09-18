import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private readonly http:HttpClient,
              private readonly router:Router
  ) { }

  userId=localStorage.getItem('userId');
  categoryId:any[]=[];
  subCategoryId:any[]=[];
  paymentId:any;
  addressId:any;
  

 
  setAddressId(id:any){
    
    this.addressId=id;
    console.log("order address set",id);
  }

  setOrder(item:any,totalAmount:number){
    this.categoryId=[];
    this.subCategoryId=[];
    item.forEach((i:any)=>{
      this.categoryId.push(i.categoryId._id)
      this.subCategoryId.push(i.subCategoryId._id)
    })

    this.placeOrder(item,totalAmount)
  }

  // placeOrder(items: any[]) {
  //   console.log(this.categoryId);
  //   console.log(this.subCategoryId);
  //   const api = 'https://api.coolieno1.in/v1.0/users/order/create-order';
  //   const requestBody = {
  //     userId: this.userId,             // Ensure this.userId is a valid ObjectId
  //     addressId: this.addressId,       // Ensure this.addressId is a valid ObjectId
  //     categoryIds:this.categoryId,
  //     subCategoryIds: this.subCategoryId              // Ensure this.subCategoryIds is an array of valid ObjectIds
  //       // example: "668d2a5a702f5e7c3b692b29"
  //     ,
  //     items: items.map(item => ({
  //       serviceId: item.serviceId,     // Ensure item.serviceId is a valid ObjectId
  //       categoryId: item.categoryId,   // Ensure item.categoryId is a valid ObjectId
  //       subCategoryId: item.subCategoryId, // Ensure item.subCategoryId is a valid ObjectId
  //       quantity: item.quantity,
  //       selectedDate: item.selectedDate, // Ensure format is consistent
  //       selectedTime: item.selectedTime, // Ensure format is consistent
  //       selectedMonth: item.selectedMonth, // Ensure format is consistent
  //       scheduledDate: new Date(item.scheduledDate) // Convert to Date object
  //     })),
  //     paymentId: "qwertyui" // Update with your actual payment ID
  //   };
    
  //   console.log(requestBody); // Log requestBody to verify
  //   this.http.post(api, requestBody).subscribe(
  //     response => {
  //       console.log(response);
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }
  
  placeOrder(items: any[],totalAmount:any) {
    console.log(items);
    const api = 'https://api.coolieno1.in/v1.0/users/order/create-order';
    console.log(this.categoryId);
    console.log(this.subCategoryId);
  
    if(!this.addressId){
      alert("please add the address");
    }
    else{
          const requestBody = {
            userId: localStorage.getItem('userId'),             
            addressId: this.addressId,       
            categoryIds: this.categoryId,
            subCategoryIds: this.subCategoryId,  
            totalAmount:totalAmount,            
            items: items.map(item => ({
              serviceId: item.serviceId, // Ensure correct property
              categoryId: item.categoryId, 
              subCategoryId: item.subCategoryId,
              quantity: item.quantity,
              selectedDate: item.selectedDate,
              selectedTime: item.selectedTime,
              selectedMonth: item.selectedMonth,
              scheduledDate: item.scheduledDate || null // Handle optional field
            })),
            paymentId: this.paymentId || "default_payment_id" // Provide default value if needed
          };
  
    console.log(requestBody); // Log requestBody to verify
  
    this.http.post(api, requestBody).subscribe(
      response => {
        console.log(response);
        alert("Order post Sucessfully")
        this.router.navigate(['afterOrder'])
      },
      err => {
        console.log(err);
        alert("Something went wrong");
      }
    );
  }
  }
  

  cancelBooking(order:any):Observable<any>{
    const api='https://api.coolieno1.in/v1.0/users/order-history/accept-order'
    return this.http.post(api,order)
  }
}
