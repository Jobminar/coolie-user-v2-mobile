import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  name:any;
  phoneNumber:any;
  image:string='';
  selectedJob:any;
  constructor(private readonly http:HttpClient) { }

  selectedJobDetails(job:any){
    console.log(job);
    this.selectedJob=job

  }

  getSelectedJob(){
    console.log(this.selectedJob);
    return this.selectedJob;
  }

  getBookingHistory():Observable<any>{
    const userId=localStorage.getItem('userId');
    const api=`https://api.coolieno1.in/v1.0/users/order/${userId}`;
    
    return this.http.get<any>(api);
  }
}
