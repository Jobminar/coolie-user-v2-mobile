import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-loading',
  templateUrl: './start-loading.component.html',
  styleUrl: './start-loading.component.css'
})
export class StartLoadingComponent {
  values: number = 0;

  constructor(private readonly router:Router) {
    this.updatingValues();
  }

  updatingValues() {
    setInterval(() => {
      if (this.values < 100) {
        this.values += 20;
      } else {
        this.values = 0; // Reset for continuous loading
      }
      if(this.values===100){
        this.router.navigate(['load'])
      }
    }, 1000);
  }
}


