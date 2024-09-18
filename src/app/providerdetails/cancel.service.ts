import { Injectable } from '@angular/core';
import { CancellationDetils } from '../../models/orderCancellation';

@Injectable({
  providedIn: 'root'
})
export class CancelService {

  // providerId:string='';
  // orderHistoryId:string=''
  private cancelDetail:CancellationDetils={
    providerId:'',
    orderHistoryId:''
  }
  constructor() { }

  set(providerId:string ,orderHistoryId:string):void{
    this.cancelDetail={providerId, orderHistoryId}
  
  }

  get():CancellationDetils{
    return {...this.cancelDetail}
  }

  clear():void{
    this.cancelDetail={
      providerId:'',
      orderHistoryId:''
    }
  }
}
