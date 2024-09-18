import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  userName:any;
  phoneNumber:number=0;
  pincode:string='';
  fullAddress:{id:string,mobilenumber:string,name:string,address:string,coordinates:any}[]=[]
  selectedAddress:any=[];
  userDetailsFromGoogle:any;
  categoryFilPincode:string='';
  categoryFilDist:string='';
  constructor(private readonly http:HttpClient) { 
    console.log('userServces working fine');
  }

  getAddress():Observable<any>{
   const userId=localStorage.getItem('userId')
    const api=`https://api.coolieno1.in/v1.0/users/user-address/${userId}`
    return this.http.get<any>(api);
  }

  setSelectedAddress(address:any){
    this.selectedAddress=address;
    // console.log("adress updated",this.selectedAddress);
  }

  getSelectedAddress():any{ 
    return this.fullAddress;
  }

  // getters and setter for pincode and dist
  getCatFillDetails(pincode:string,dist:string){
    this.categoryFilPincode=pincode;
    this.categoryFilDist=dist;
    // console.log(this.categoryFilDist,this.categoryFilPincode);
  }

  setCatFillDetails():{pincode:string,dist:string}{
    // console.log(this.categoryFilPincode,this.categoryFilDist);
    return{ pincode:this.categoryFilPincode,dist:this.categoryFilDist}
  }


  formatingAddress(address:any){
   
    if (Array.isArray(address)) {
      console.log("is an array",address);
    }
    else{
      address=[address];
      console.log("not an array",address);
    }
    this.fullAddress=[];
    address.map((element:any) => {
      const name=element.username;
      const respAddress=element.address+" "+element.landmark+" "+element.city+" "+element.state+element.pincode
      const coordinates:any[] =[element.longitude,element.latitude];
      this.fullAddress.push({'id':element._id,'mobilenumber':element.mobileNumber,'name':name,'address':respAddress,'coordinates':coordinates})
    });

    console.log(this.fullAddress);
  }

  edit(data:any){
    const userId=localStorage.getItem('userId');
    const api=`https://api.coolieno1.in/v1.0/users/userAuth/${userId}`;
   return this.http.put(api,data);
  }
}
