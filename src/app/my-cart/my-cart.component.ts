import { Component, OnInit } from '@angular/core';
import { MyCartService } from '../services/my-cart.service';
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { Location } from '@angular/common';
import { RazorpayService } from '../services/razorpay.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrl: './my-cart.component.css',
})
export class MyCartComponent implements OnInit {
  loading:boolean=false;
  selectedTime: number = 0;
  expandedIndex: number | null = null;
  subCategoryVarient: any = [];
  showScheduleSection: boolean = false;
  nextFourDays: any[] = [];
  selectedIndex: number = 0;
  selectedSechudle: any;
  date = new Date();
  // selectedDate:any;
  monthSelected: any = String(this.date.getMonth() + 1).padStart(2, '0');
  dateSelected: any = String(this.date.getDate()).padStart(2, '0');
  time: any;
  amount: number = 0;
  // currentTime:number=0;
  navToBack() {
    this.location.back();
  }
  constructor(
    private readonly mycartService: MyCartService,
    private readonly router: Router,
    private readonly orderService: OrdersService,
    private readonly location: Location,
    private readonly razorpayService: RazorpayService
  ) {}
  ngOnInit(): void {
    this.getCurrentTime();
    this.getNextFourDays();
    this.getCartItems();
  }

  // timing:any[]=[];
  // getCurrentTime(){
  //   this.currentTime=new Date().getHours()
  //   for (let index = 0; index < 12; index++) {
  //     this.currentTime++;
  //     let tempTime=this.currentTime;
  //     let timeStamp='Am'
  //     if (this.currentTime===22) {
  //       break
  //     }
  //     if (this.currentTime>12) {
  //       tempTime=tempTime-12
  //       timeStamp='Pm'
  //     }
  //     this.timing.push({time:tempTime,stamp:timeStamp, isSelected: false})

  //   }
  //   console.log(this.timing);
  // }
  currentTime: number = 0;
  timing: Array<{ time: number; stamp: string; isSelected: boolean }> = [];
  selectedDate: any = new Date(); // Assume this gets set when a user selects a date

  getCurrentTime() {
    this.timing = []; // Clear the previous timings
    const now = new Date();

    // Check if the selected date is today
    const isToday = this.selectedDate.toString() === now.toString();

    if (isToday) {
      // Start from the current hour if the user selects today
      this.currentTime = now.getHours();
    } else {
      // Start from 9 AM if the user selects tomorrow or a future date
      this.currentTime = 9;
    }

    for (let index = 0; index < 12; index++) {
      let tempTime = this.currentTime;
      let timeStamp = 'AM';

      if (this.currentTime >= 22) {
        // End at 9 PM
        break;
      }

      if (this.currentTime >= 12) {
        timeStamp = this.currentTime === 12 ? 'PM' : 'PM';
        if (this.currentTime > 12) {
          tempTime = this.currentTime - 12;
        }
      }

      this.timing.push({ time: tempTime, stamp: timeStamp, isSelected: false });
      this.currentTime++;
    }

    console.log(this.timing);
  }

  getCartItems() {
    const userId: any = localStorage.getItem('userId');
    this.mycartService.getCartItems(userId).subscribe(
      (response) => {
        console.log(response);
        this.subCategoryVarient = response[0].items;
        this.calAmount();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  expand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Collapse if the same index is clicked
    } else {
      this.expandedIndex = index; // Expand the new index
    }
  }

  delete(id: any, item: any) {
    console.log(item);
    this.mycartService.delete(id).subscribe({
      next: (response) => {
        console.log('item delete', response);
        this.getCartItems();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  decrementCount(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }
  incrementCount(item: any) {
    console.log(item);
    this.amount = this.amount;
    // this.calAmount();
    item.quantity++;
  }

  // schedule


  showSchedule() {
    this.showScheduleSection = !this.showScheduleSection;
  }
  // date======

  async getNextFourDays() {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);
      const formattedDate = this.formatDate(currentDay);

      this.nextFourDays.push({
        date: formattedDate,
        day: days[currentDay.getDay()],
        workingStaus: false,
      });
    }
    this.selectedDate = this.nextFourDays[0];
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }

  selected(item: any, index: any) {
    console.log(item);
    console.log(this.selectedDate);
    this.selectedIndex = index;
    this.selectedDate = this.nextFourDays[index];
    console.log(this.selectedDate);
    this.selectedSechudle = this.selectedDate.date;
    this.dateSelected = item.date.toString().split('-')[0];
    // this.daySelected = item.day;
    this.monthSelected = item.date.toString().split('-')[1];
    // this.yearSelected=item.date.toString().split('-')[2];
    // this.nextDaysOfIndex = this.nextFourDays[this.selectedIndex];
    // console.log(this.nextDaysOfIndex);
    console.log(this.monthSelected);
    console.log(this.dateSelected);
    this.getCurrentTime();
  }

  //time

  // timing: any[] = [
  //   { time: '09 AM', isSelected: false },
  //   { time: '10 AM', isSelected: false },
  //   { time: '11 AM', isSelected: false },
  //   { time: '12 PM', isSelected: false },
  //   { time: '01 PM', isSelected: false },
  //   { time: '02 PM', isSelected: false },
  //   { time: '03 PM', isSelected: false },
  //   { time: '04 PM', isSelected: false },
  //   { time: '05 PM', isSelected: false },
  //   { time: '06 PM', isSelected: false },
  //   { time: '07 PM', isSelected: false },
  //   { time: '08 PM', isSelected: false },
  //   { time: '09 PM', isSelected: false },

  // ];

  timeSelected(index: number) {
    this.selectedTime = index;
    this.time = this.timing[index].time + ' ' + this.timing[index].stamp;
    console.log(this.time);
    this.selectedSechudle = this.selectedDate.date + ' ' + this.time;
    this.sendOrder();
  }

  // amounts

  calAmount() {
    this.subCategoryVarient.forEach((item: any) => {
      this.amount = this.amount + item.serviceId.serviceVariants[0].price;
    });
  }
  navToSeparate() {
    this.router.navigate(['separateSechedule']);
  }

  sendOrder() {
    const item = this.subCategoryVarient;

    for (let index = 0; index < item.length; index++) {
      const element = item[index];
      element['selectedDate'] = this.dateSelected;
      element['selectedMonth'] = this.monthSelected;
      element['scheduledDate'] = this.selectedSechudle;
      element['selectedTime'] = this.time;
    }
    console.log(item);
    this.subCategoryVarient = item;
  }
  pay() {
   
    if (!this.orderService.addressId) {
      alert('Please select an address.');
      return;
    }
    this.loading=true;
    const currency = 'INR';
    const orderId = 'order_id_from_backend';
    this.razorpayService
      .payWithRazorpay(this.amount, orderId, currency)
      .subscribe({
        next: (data) => {
          this.loading=false;
          console.log('Payment successful', data);
          this.orderService.setOrder(this.subCategoryVarient, this.amount);
          // Handle successful payment
        },
        error: (err) => {
          this.loading=false;
          console.log('Payment failed', err);
          alert('Something went wrong. please try again later.');
          // Handle payment failure
        },
      });
      
    // this.orderService.setOrder(this.subCategoryVarient)
  }

  //user id, addressId,[catId],[subCatid],items=[{"of services",sechdule time}],
}
