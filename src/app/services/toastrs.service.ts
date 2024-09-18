import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrsService {

  constructor(private readonly toastr: ToastrService){ 
    // this.toastr.success('Hello world!', 'Toastr fun!');
    // this.toastr.info('Just some information for you.');
    // this.toastr.success('Hello world!', 'Toastr fun!', {
    //   timeOut: 2000,
    //   positionClass: 'toast-top-center',
    // });
  }

  showSuccess(message: string, title?: string) {
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-center-center', 
      toastClass: 'toast-custom-class', 
    
    });
  }

  showError(message: string, title?: string) {
    this.toastr.error(message, title, {
      timeOut: 3000,
      positionClass: 'toast-error-center',
    
      toastClass: 'toast-custom-class-error', // Another custom class
    });
  }

  showInfo(message: string, title?: string) {
    this.toastr.error(message, title, {
      timeOut: 3000,
      positionClass: 'toast-center-center', 
      toastClass: 'toast-custom-class-info', // Another custom class
    });
  }

  showWarning(message: string, title?: string) {
    this.toastr.warning(message, title);
  }

}
