import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DemoService } from '../services/demo.service';

@Component({
  selector: 'app-fotter',
  templateUrl: './fotter.component.html',
  styleUrl: './fotter.component.css'
})
export class FotterComponent {
  activeIcon: string = 'home'; // Default active icon

  constructor(private readonly router: Router,
              private demoService: DemoService
  ) {}

  ngOnInit() {
    // Listen for route changes
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.setActiveIcon(event.urlAfterRedirects);
    //   }
    // });

    // Set the initial active icon based on the current route
    this.setActiveIcon(this.router.url);
  }

  changeColor(icon: string, item: string) {
    this.activeIcon = icon;
    const userId=localStorage.getItem('userId');
    if (!userId) {
      // alert("Please log in ")
      this.demoService.openDialog("Need to login first");
      this.router.navigate(['auth']);
    }
    else{
      this.router.navigate([item]);
    }
    
    console.log(item);
  }

  setActiveIcon(url: string) {
    if (url.includes('home')) {
      this.activeIcon = 'home';
    } else if (url.includes('mainService')) {
      this.activeIcon = 'Services';
    } else if (url.includes('bookingHistory')) {
      this.activeIcon = 'Activity';
    } else if (url.includes('profile')) {
      this.activeIcon = 'Account';
    }
  }

}
