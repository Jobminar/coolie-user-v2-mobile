import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FilteredServiceInterface } from '../../models/filteringService';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  selectedUiVarientIndex:number=0;
  api='https://api.coolieno1.in/v1.0';
  serviceFromPincode:any[]=[];
  filteredService:FilteredServiceInterface[]=[]
  constructor(private readonly http:HttpClient) { 
    this.getServicesOnLocation();
  }

  getServicesOnLocation(){
     this.http.get<any>(this.api+'/core/locations/500032').subscribe({
      next:(response)=>{
        console.log("services",response);
        this.serviceFromPincode=response;
        this.filteringCatAndPrice(response);
      },
      error:(err)=>{
        console.log(err);
      }
     })
  }
  
// filtering the category name and price and storing it in a variable returns only category and price

  filteringCatAndPrice(response: any) {
    
    try {
      if (!response || !Array.isArray(response) || response.length === 0) {
        // Throw an error if the response is undefined, not an array, or an empty array
        return ;
      }
      this.filteredService=[];
      // Proceed with processing if the response is valid
      response.forEach((cat: any) => {
        this.filteredService.push({ category: cat.category, price: cat.price });
      });
      console.log(this.filteredService);
    } catch (error) {
      // Handle any other errors
      console.error('An error occurred:', error);
    }
  }
  
  // filtering the service according to service location;
  filteringService(service: any):any {
    const ser = service.filter((cat: any) => {
      // Use `some` to check if any category in `this.filteredService` matches the `cat.name`
      return this.filteredService.some((i: any) => i.category && cat.name && cat.name.toLowerCase().includes(i.category.toLowerCase()));
    });
  
    console.log(ser);
    return ser;
  }
  
  getService():Observable<any>{
  
    return this.http.get<any>(this.api+'/core/categories');
  }

  getMostBooked():Observable<any>{
    return this.http.get<any>(this.api+'/admin/most-booked')
  }
  selectedServiceId:any;
  selectedIndex:any;
  readyToGetSubCategory(id:any,index:any){
   this.selectedServiceId=id
   console.log(index);
   this.selectedIndex=index
   console.log(this.selectedIndex);
  }

  getSubCategoty(id:any):Observable<any>{
    const api=`https://api.coolieno1.in/v1.0/core/sub-categories/category/${id}`
     return this.http.get<any>(api);
  }

  getSubCatVarient(catId:any,subCatId:any){
    const api=`https://api.coolieno1.in/v1.0/core/services/filter/${catId}/${subCatId}`;
    return this.http.get<any>(api)
  }

  getSubCatVarientFromLocation(dist:any){
    const api=`https://api.coolieno1.in/v1.0/core/locations/district/${dist}`;
    return this.http.get<any>(api);
  }

  getPriceAccPincode(pincode:any):Observable<any>{
    const api=`https://api.coolieno1.in/v1.0/core/locations/custom/${pincode}`;
    return this.http.get<any>(api);
  }
  
  getCoreService():Observable<any>{
    const api='https://api.coolieno1.in/v1.0/admin/our-core-services';
    return this.http.get<any>(api);
  }

  getReels():Observable<any>{
    const api='https://api.coolieno1.in/v1.0/admin/reels/video';
    return this.http.get<any>(api);
  }

  getAcAppliances():Observable<any>{
    const api='https://api.coolieno1.in/v1.0/admin/appliances';
    return this.http.get<any>(api);
  }

  getPopularServices():Observable<any>{
    const api='https://api.coolieno1.in/v1.0/admin/our-popular-service';
    return this.http.get<any>(api);
  }


}
