// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AuthenticationModule } from './authentication/authentication.module';


// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { HomeComponent } from './home/home.component';
// import { FotterComponent } from './fotter/fotter.component';
// import { MainServiceComponent } from './main-service/main-service.component';
// import { SubServicesComponent } from './sub-services/sub-services.component';
// import { ProfileComponent } from './profile/profile.component';
// import { EditProfileComponent } from './edit-profile/edit-profile.component';
// import { AddressComponent } from './address/address.component';
// import { BookingHistoryComponent } from './booking-history/booking-history.component';
// import { BookingDetailsComponent } from './booking-details/booking-details.component';
// import { InviteComponent } from './invite/invite.component';
// import { DemoComponent } from './demo/demo.component';


// import { fireBaseCredential } from '../environment/firebaseCredentials';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { ToastrModule } from 'ngx-toastr';

// @NgModule({
//   declarations: [
//     AppComponent,
//     HomeComponent,
//     FotterComponent,
//     MainServiceComponent,
//     SubServicesComponent,
//     ProfileComponent,
//     EditProfileComponent,
//     AddressComponent,
//     BookingHistoryComponent,
//     BookingDetailsComponent,
//     InviteComponent,
//     DemoComponent,

//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     HttpClientModule,
//     ReactiveFormsModule,
//     AuthenticationModule,
//     AngularFireModule.initializeApp(fireBaseCredential.fireBaseConfig),
//     AngularFireAuthModule,
//     ToastrModule.forRoot(),
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FotterComponent } from './fotter/fotter.component';
import { MainServiceComponent } from './main-service/main-service.component';
import { SubServicesComponent } from './sub-services/sub-services.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddressComponent } from './address/address.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { InviteComponent } from './invite/invite.component';
import { DemoComponent } from './demo/demo.component';

import { fireBaseCredential } from '../environment/firebaseCredentials';
import { MyCartComponent } from './my-cart/my-cart.component';
import { SeperateSecheduleComponent } from './seperate-sechedule/seperate-sechedule.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { RewardsComponent } from './rewards/rewards.component';
import { CouponComponent } from './coupon/coupon.component';
import { WalletsComponent } from './wallets/wallets.component';
import { LoyolityComponent } from './loyolity/loyolity.component';
import { AboutComponent } from './about/about.component';
import { PolicyComponent } from './policy/policy.component';
import { HelpsComponent } from './helps/helps.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { SelectAddressComponent } from './select-address/select-address.component';
import { AfterOrderComponent } from './after-order/after-order.component';
import { MapsComponent } from './maps/maps.component';
import { LocationComponent } from './location/location.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxLoadingModule } from "ngx-loading";
import { GoogleMapsModule } from '@angular/google-maps';
import { StartLoadingComponent } from './start-loading/start-loading.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FotterComponent,
    MainServiceComponent,
    SubServicesComponent,
    ProfileComponent,
    EditProfileComponent,
    AddressComponent,
    BookingHistoryComponent,
    BookingDetailsComponent,
    InviteComponent,
    DemoComponent,
    MyCartComponent,
    SeperateSecheduleComponent,
    OrderSummaryComponent,
    OrderDetailsComponent,
    RewardsComponent,
    CouponComponent,
    WalletsComponent,
    LoyolityComponent,
    AboutComponent,
    PolicyComponent,
    HelpsComponent,
    AddAddressComponent,
    SelectAddressComponent,
    AfterOrderComponent,
    MapsComponent,
    LocationComponent,
    StartLoadingComponent,
  
   
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule ,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(fireBaseCredential.fireBaseConfig), // Initialize Firebase here
    AngularFireAuthModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    NgxLoadingModule.forRoot({}),
    MatDialogModule,
    GoogleMapsModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
