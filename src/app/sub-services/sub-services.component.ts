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
   
    this.selectedCat = this.servicesService.selectedIndex;
    this.getService();
    this.getPriceAndServiceAccLocation();
    this.getCount();
  }
  // getting the services and assign the value to this.services
  getService() {
    this.servicesService.getService().subscribe(
      (response) => {
        console.log(response,"services main ");
        this.services = response;
        this.getSubCategories(this.servicesService.selectedServiceId);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPriceAndServiceAccLocation() {
    // console.log("==============================================================================");
    console.log(this.userDetails.categoryFilPincode, this.userDetails.categoryFilDist);

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
        console.log(this.priceFromLoc, 'price from pincode');
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
    this.subCategory=[];
    this.servicesService.selectedServiceId = item;
    this.servicesService.selectedIndex = index;
    this.getSubCategories(item);

    this.selectedCat = index;
    // console.log('ui test', this.services[this.selectedCat].uiVariant);
    // this.selectedSubCatIndex = 0;
    // this.nameOfUiVarientSelected =this.services[this.selectedCat].uiVariant[0];
    // this.selectedIndex = 0;
    // this.servicesService.selectedUiVarientIndex = 0;
    // this.selectVariant(0);
  }

  // getting the subcategories from selected category then assign the values to subCategory
  // then calling the getCategoryVarient() to get the uivarients
  getSubCategories(id: any) {
   
    this.servicesService.getSubCategoty(id).subscribe({
      next: async (response) => {
        console.log(response, 'sub cat  normal');
        // this.subCategory = response;
          this.subCategory= this.filteringSubCat(response);
        // if (this.services[this.selectedCat].uiVariant.length === 1) {
          this.nameOfUiVarientSelected =this.services[this.selectedCat].uiVariant[0];
          this.selectedSubCatIndex = 0;
          this.selectedIndex = 0;
          this.servicesService.selectedUiVarientIndex = 0;
         await this.selectVariant(0);
          this. selectSubCategory(0)
        // }
        
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

  filteringSubCat(item: any): any[] {
    const filteredItems: any[] = [];
  
    let full= item.filter((i: any) => 
      this.subCatVarFromLocation.some((ser: any) => 
        i.name.toLowerCase() === ser.subcategory.toLowerCase()
      )
    );
  console.log("filtered ===",full);
    // Return the filtered items after the process is completed
    return full;
  }
  
  // when user select the sub-category we are assigning the index of selected sub-cat to selectedSubCatIndex
  // And calling to getSubCategoryVarients() to get the ui varients 

  selectSubCategory(index: any) {
    // this.selectedIndex=this.servicesService.selectedUiVarientIndex;
    this.selectedSubCatIndex = index;
    this.getSubCategoryVarient();
  }



  filteredSubCat: any = [];
  selectVariant(index: number): void {
    this.filteredVarients = [];
    // console.log(index, 'index ');
    this.servicesService.selectedUiVarientIndex = index;
    this.selectedIndex = this.servicesService.selectedUiVarientIndex;

    const selectedVariantName = this.services[this.selectedCat].uiVariant[this.selectedIndex];
    console.log('uivareint name', selectedVariantName);
    this.nameOfUiVarientSelected = selectedVariantName;
    console.log("sub category at filtering the services by varients",this.subCategory);
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
   
    console.log('sub category after filtering ui vaeints', this.filteredSubCat);
    
    this.selectSubCategory(0);
  }


  
  // getting the sub-category services varients like 1bhk 2bhk and sending this to add() to add the count in each varient
  getSubCategoryVarient() {
    const selectedId = this.servicesService.selectedServiceId;
    const selectedSubCatId = this.filteredSubCat[this.selectedSubCatIndex]._id;
    // console.log("seleted cat id",selectedId, "selected sub cat id",selectedSubCatId);
    this.servicesService
      .getSubCatVarient(selectedId, selectedSubCatId)
      .subscribe(
        (response) => {
          console.log(response,"service verits ");
          this.addingCount(response);
        },
        (error) => {
          console.log(error);
          this.subCategoryVarient = [];
          this.filteredVarients = [];
        }
      );
  }
  // adding the quantity
  addingCount(item: any) {
    console.log(item,"before adding count");
    item = item.map((element: any) => {
      return { ...element, count: 1, isAdded: false };
    });

    console.log(item);

    this.filterAccLocation(item);
    // this.selectVariant();
  }

  // filteringAccording to location
  filterAccLocation(item: any) {
    console.log(item,"for cheking before adding price");
    // this.filteredVarients = [];
 
    let fill: any[] = []; // Initialize 'fill' as an empty array
    console.log(this.subCatVarFromLocation, 'sub-cat varient from location');
    console.log(
      this.services[this.selectedCat].uiVariant[this.selectedIndex],
      'ui name'
    );
    this.nameOfUiVarientSelected = this.services[this.selectedCat].uiVariant[0];
    if (this.subCatVarFromLocation.length!=0) {
      this.subCatVarFromLocation.forEach((i: any) => {
        // Filter items based on the matching servicename and cat name
        const matches = item
          .filter(
            (cat: any) => i.servicename.toLowerCase() === cat.name.toLowerCase()
          )
          .map((cat: any) => {
            
             // Add the price from subCatVarFromLocation to each matched item 
            //  checking whether offer price is provided for this service. If yes 
            // adding the offer price also
            if (Object.keys(i.offerPrice).length!=0) {
              // console.log(i.offerPrice,"offer price");
              return {
                ...cat,
                price:i.price[this.nameOfUiVarientSelected],
                offerPrice:i.offerPrice[this.nameOfUiVarientSelected]
              }
            }
            else{
              return {
                ...cat, // Spread the original cat object
                offerPrice:"0",
                price: Number(i.price[this.nameOfUiVarientSelected]), // Add the price from subCatVarFromLocation
              };
            }
           
          
          });
  
        // Concatenate the matches with 'fill'
        fill = fill.concat(matches);
      });

      if (fill.length===0) {
        fill=item;
      }
    } else {
      fill=item;
    }
  

    console.log(fill, 'fill');
    this.addingPrice(fill);
    this.subCategoryVarient = fill;
    this.filteredVarients = fill;
  }

  // adding the price to the filtered services
  // adding the custom price if the service has an cutom price
  addingPrice(fill: any) {
    console.log(
      this.services[this.selectedCat]?.uiVariant[this.selectedIndex],
      'name of the ui vareint'
    );
    this.nameOfUiVarientSelected = this.services[this.selectedCat].uiVariant[0];
    console.log(fill,"forchecking");
    console.log(this.priceFromLoc,"for checking");
    let addedPrice;
    
    /**
     * mapping the serive getting defult and checking whether the cprices comming through the pincode
     * api 
     */
    const add = fill.map((i: any) => {
      this.priceFromLoc.forEach((priceFL) => {
        if (i.name === priceFL.servicename) {
          if (priceFL.isCustom) {
            console.log('is custum price');
            i.price = Number(priceFL.price[this.nameOfUiVarientSelected]);
          }
        }
      });
      return i;
    });

    console.log(add, 'added custom price');
  }

  // expandedIndex: number | null = null;

  // expand(index: number): void {
  //   if (this.expandedIndex === index) {
  //     this.expandedIndex = null; // Collapse if the same index is clicked
  //   } else {
  //     this.expandedIndex = index; // Expand the new index
  //   }
  // }

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
    let price:number | null=null
    if (!localStorage.getItem('userId')) {
      this.demoService.openDialog('Need to login to add service');
      this.router.navigate(['auth']);
    }
    console.log(item);
    const userId = this.authenticService.getFromLocalStorage();
    if (item.offerPrice!=0 && item.offerPrice !=undefined) {
      price=Number(item.offerPrice)
    }
    else{
      price=Number(item.price)
    }
    console.log(price,"price for cart");
    const requestBody = [
      {
        categoryId: item.categoryId._id,
        subCategoryId: item.subCategoryId._id,
        serviceId: item._id,
        quantity: item.count,
        price:price,
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
