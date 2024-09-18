import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MainServiceComponent } from './main-service/main-service.component';
import { SubServicesComponent } from './sub-services/sub-services.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddressComponent } from './address/address.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { InviteComponent } from './invite/invite.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { DemoComponent } from './demo/demo.component';
import { SeperateSecheduleComponent } from './seperate-sechedule/seperate-sechedule.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { CouponComponent } from './coupon/coupon.component';
import { LoyolityComponent } from './loyolity/loyolity.component';
import { PolicyComponent } from './policy/policy.component';
import { RewardsComponent } from './rewards/rewards.component';
import { WalletsComponent } from './wallets/wallets.component';
import { AboutComponent } from './about/about.component';
import { HelpsComponent } from './helps/helps.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { AfterOrderComponent } from './after-order/after-order.component';
import { MapsComponent } from './maps/maps.component';
import { LocationComponent } from './location/location.component';
import { authGuard } from './auth.guard';
import { StartLoadingComponent } from './start-loading/start-loading.component';

const routes: Routes = [
  // {path:'load',component:StartLoadingComponent},
  {path:'',component:LocationComponent},
  {path:'home',component:HomeComponent},
  {path:'auth',loadChildren:()=> import('./authentication/authentication.module').then(m=>m.AuthenticationModule)},
  {path:'mainService',component:MainServiceComponent},
  {path:'subServices',component:SubServicesComponent},
  {path:'profile',component:ProfileComponent},
  {path:'editProfile',component:EditProfileComponent},
  {path:'address',component:AddressComponent},
  {path:'addAddress',component:AddAddressComponent},
  {path:'bookingHistory',component:BookingHistoryComponent},
  {path:'bookingDetails',component:BookingDetailsComponent},
  {path:'invite',component:InviteComponent},
  {path:'coupons',component:CouponComponent},
  {path:'loyolityPoint',component:LoyolityComponent},
  {path:'policy',component:PolicyComponent},
  {path:'rewards',component:RewardsComponent},
  {path:'wallet',component:WalletsComponent},
  {path:'about',component:AboutComponent},
  {path:'help',component:HelpsComponent},
  {path:'myCart',component:MyCartComponent},
  {path:'separateSechedule',component:SeperateSecheduleComponent},
  {path:'orderSummary',component:OrderSummaryComponent},
  {path:'orderDetails',component:OrderDetailsComponent},
  {path:'provider',loadChildren:()=>import ('../app/providerdetails/providerdetails.module').then(i=>i.ProviderdetailsModule)},
  {path:'demo',component:DemoComponent},
  {path:'afterOrder',component:AfterOrderComponent},
  {path:'maps',component:MapsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
