import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { Location } from '@angular/common';
import { MyCartService } from '../services/my-cart.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { DemoService } from '../services/demo.service';
import { UserDetailsService } from '../services/user-details.service';
import { catchError, combineLatest, forkJoin, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sub-services',
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.css',
})
export class SubServicesComponent implements OnInit {
  services: any = [];
  subCategory: any = [];
  subCategoryVarient: any = [];
  noOfItems: number = 0;
  selectedCat: any;
  selectedSubCatIndex = 0;
  selectedIndex: number = 0;
  filteredVarients: any = [];
  nameOfUiVarientSelected: string = '';
  counts: number = 1;
  priceFromLoc: any[] = [];
  subCatVarFromLocation: any[] = [];
  selectedPincode: string = '';
  selectedDist: string = '';
  constructor(
    private readonly servicesService: ServiceService,
    private readonly location: Location,
    private readonly router: Router,
    private readonly userDetails: UserDetailsService,
    private readonly demoService: DemoService,
    private readonly orderService: OrdersService,
    private readonly myCartService: MyCartService,
    private readonly authenticService: AuthenticationService
  ) {}

  ngOnInit(): void {
    console.log(this.userDetails.setCatFillDetails());
    // console.log(this.servicesService.selectedIndex);
    this.selectedCat = this.servicesService.selectedIndex;
    // console.log(this.selectedCat);
    this.getService();
    //  this.getSubCategories(this.servicesService.selectedServiceId)

    // this.getLocationService();
    this.getPriceAndServiceAccLocation();
    this.getCount();
  }
  // getting the services and assign the value to this.services
  getService() {
    this.servicesService.getService().subscribe(
      (response) => {
        console.log(response);
        this.services = response;
        this.getSubCategories(this.servicesService.selectedServiceId);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // get the service according to location dist
  getLocationService() {
    this.servicesService
      .getSubCatVarientFromLocation(this.userDetails.setCatFillDetails().dist)
      .subscribe({
        next: (res) => {
          console.log(res, 'from location');
          this.subCatVarFromLocation = res;
        },
        error: (err) => console.log(err),
      });
  }

  getPriceAccPincode() {
    this.servicesService
      .getPriceAccPincode(this.userDetails.setCatFillDetails().pincode)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getPriceAndServiceAccLocation() {
    // console.log("==============================================================================");
    // console.log(this.userDetails.categoryFilPincode, this.userDetails.categoryFilDist);

    combineLatest([
      this.servicesService
        .getSubCatVarientFromLocation(this.userDetails.setCatFillDetails().dist)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            console.error('Error fetching service:', err);
            return of([]); // Return an empty array if the API fails
          })
        ),
      this.servicesService
        .getPriceAccPincode(this.userDetails.setCatFillDetails().pincode)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            console.error('Error fetching price:', err);
            return of([]); // Return an empty array if the API fails
          })
        ),
    ]).subscribe({
      next: ([serviceResponse, priceResponse]) => {
        // console.log("from dist and location", { serviceResponse, priceResponse });
        this.subCatVarFromLocation = serviceResponse;
        this.priceFromLoc = priceResponse;
        console.log(this.priceFromLoc, 'price from loc');
        console.log(this.subCatVarFromLocation, 'service from loc');
      },
      error: (err) => {
        console.error('Error in combineLatest:', err); // In case of an unexpected error
      },
    });
  }

  // getting the selected category by defult we are getting from main servies
  // assigning the index and item to services service
  // then getting the subcategories

  selectedCategory(item: any, index: any) {
   this.filteredSubCat=[];
 
    this.servicesService.selectedServiceId = item;
    this.servicesService.selectedIndex = index;
    this.getSubCategories(item);
    this.nameOfUiVarientSelected = this.services[this.selectedCat].uiVariant[0];
    this.selectedCat = index;
    // console.log('ui test', this.services[this.selectedCat].uiVariant);
    
    this.servicesService.selectedUiVarientIndex = 0;
    this.selectVariant(0);
  }

  // getting the subcategories from selected category then assign the values to subCategory
  // then calling the getCategoryVarient() to get the uivarients
  getSubCategories(id: any) {
    console.log("getting subcat----------------");
    this.servicesService.getSubCategoty(id).subscribe({
      next: (response) => {
        console.log(response, 'sub cat  normal');
        this.subCategory = response;
        if (this.services[this.selectedCat].uiVariant.length === 1) {
          this.nameOfUiVarientSelected =
            this.services[this.selectedCat].uiVariant[0];
          this.selectedIndex = 0;
          this.servicesService.selectedUiVarientIndex = 0;
          this.selectVariant(0);
        }
        this.getSubCategoryVarient();
      },
      error: (error) => {
        console.log(error);
        console.log(error.error.message);
        if (
          error.error.message === 'No subcategories found for this category'
        ) {
          this.subCategory = [];
          this.subCategoryVarient = [];
        }
      },
    });
  }

  // when user select the sub-category we are assigning the index of selected sub-cat to selectedSubCatIndex
  // And calling to getSubCategoryVarients() to get the ui varients

  selectSubCategory(index: any) {
    // this.selectedIndex=this.servicesService.selectedUiVarientIndex;
    this.selectedSubCatIndex = index;
    this.getSubCategoryVarient();
  }

  // getting the sub-category services varients like 1bhk 2bhk and sending this to add() to add the count in each varient
  getSubCategoryVarient() {
    const selectedId = this.servicesService.selectedServiceId;
    const selectedSubCatId = this.subCategory[this.selectedSubCatIndex]._id;
    this.servicesService
      .getSubCatVarient(selectedId, selectedSubCatId)
      .subscribe(
        (response) => {
          console.log(response);
          this.addingCount(response);
        },
        (error) => {
          console.log(error);
          this.subCategoryVarient = [];
          this.filteredVarients = [];
        }
      );
  }

  filteredSubCat: any = [];
  selectVariant(index: number): void {
    
    // console.log(index, 'index ');
    this.servicesService.selectedUiVarientIndex = index;
    this.selectedIndex = this.servicesService.selectedUiVarientIndex;

    const selectedVariantName = this.services[this.selectedCat].uiVariant[this.selectedIndex];
    // console.log('uivareint name', selectedVariantName);
    this.nameOfUiVarientSelected = selectedVariantName;
    // console.log(this.nameOfUiVarientSelected, 'name');
    if (selectedVariantName != 'None') {
      const filteredVariants = this.subCategory.filter(
        (item: any) =>
          item.variantName?.toLowerCase() === selectedVariantName?.toLowerCase()
      );
      this.filteredSubCat = filteredVariants;
    } else {
      this.filteredSubCat = this.subCategory;
    }
    //   const filteredVariants = this.subCategory.filter((item: any) => item.variantName?.toLowerCase()=== selectedVariantName?.toLowerCase());
    // this.filteredSubCat=filteredVariants;
    console.log('sub category after filtering ui vaeints', this.filteredSubCat);
  }

  // adding the quantity
  addingCount(item: any) {
    item = item.map((element: any) => {
      return { ...element, count: 1, isAdded: false };
    });

    console.log(item);

    this.filterAccLocation(item);
    // this.selectVariant();
  }

  // filteringAccording to location
  filterAccLocation(item: any) {
    // let fill: any[] = []; // Initialize 'fill' as an empty array
    // console.log(this.subCatVarFromLocation,"from location");
    // this.subCatVarFromLocation.forEach((i: any) => {
    //   const matches = item.filter((cat: any) =>
    //     i.servicename.toLowerCase() === cat.name.toLowerCase()
    //   );

    //   fill = fill.concat(matches); // Concatenate the matches to 'fill'
    // });
    // console.log(fill, "fill");
    let fill: any[] = []; // Initialize 'fill' as an empty array
    console.log(this.subCatVarFromLocation, 'from location');
    console.log(
      this.services[this.selectedCat].uiVariant[this.selectedIndex],
      'ui name'
    );
    this.nameOfUiVarientSelected = this.services[this.selectedCat].uiVariant[0];
    this.subCatVarFromLocation.forEach((i: any) => {
      // Filter items based on the matching servicename and cat name
      const matches = item
        .filter(
          (cat: any) => i.servicename.toLowerCase() === cat.name.toLowerCase()
        )
        .map((cat: any) => {
          // Add the price from subCatVarFromLocation to each matched item
          return {
            ...cat, // Spread the original cat object
            price: i.price[this.nameOfUiVarientSelected], // Add the price from subCatVarFromLocation
          };
        });

      // Concatenate the matches with 'fill'
      fill = fill.concat(matches);
    });

    console.log(fill, 'fill');
    this.addingPrice(fill);
    this.subCategoryVarient = fill;
    this.filteredVarients = fill;
  }

  // adding the price to the filtered services
  addingPrice(fill: any) {
    console.log(
      this.services[this.selectedCat]?.uiVariant[this.selectedIndex],
      'name of the ui vareint'
    );
    this.nameOfUiVarientSelected = this.services[this.selectedCat].uiVariant[0];
    let addedPrice;
    const add = fill.map((i: any) => {
      this.priceFromLoc.forEach((priceFL) => {
        if (i.name === priceFL.servicename) {
          if (priceFL.isCustom) {
            console.log('is custum price');
            i.price = priceFL.price[this.nameOfUiVarientSelected];
          }
        }
      });
      return i;
    });

    console.log(add, 'added custom price');
  }

  expandedIndex: number | null = null;

  expand(index: number): void {
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Collapse if the same index is clicked
    } else {
      this.expandedIndex = index; // Expand the new index
    }
  }

  incrementCount(index: any): void {
    index.count++;
  }

  decrementCount(index: any): void {
    if (index.count > 1) {
      index.count--;
    } else {
      index.isAdded = false;
    }
  }

  // adding item to cart
  addItem(item: any): void {
    if (!localStorage.getItem('userId')) {
      this.demoService.openDialog('Need to login to add service');
      this.router.navigate(['auth']);
    }
    console.log(item);
    const userId = this.authenticService.getFromLocalStorage();
    const requestBody = [
      {
        categoryId: item.categoryId._id,
        subCategoryId: item.subCategoryId._id,
        serviceId: item._id,
        quantity: item.count,
        image: item.subCategoryId.imageKey,
        // price:item.serviceVariants[0].price*item.count
      },
    ];

    this.myCartService.addToCart(userId, requestBody).subscribe(
      (res) => {
        console.log(res);
        item.isAdded = true;
        this.demoService.openDialog('Service added sucessfully');
        // alert("Service added sucessfully");
        // this.router.navigate(['myCart'])
        this.getCount();
      },
      (err) => {
        console.log(err);
      }
    );
    // console.log(`Index: ${index}, Count: ${this.counts}`);
  }

  // getting the count inside the cart
  getCount() {
    this.myCartService.getingLength().subscribe((length) => {
      console.log(`Number of items in cart: ${length}`);
      this.noOfItems = length;
    });
  }
  navToCart() {
    this.router.navigate(['myCart']);
  }
  navToBack() {
    this.location.back();
  }
}
