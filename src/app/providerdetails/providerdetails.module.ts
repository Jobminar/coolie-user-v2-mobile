import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackproviderComponent } from './trackprovider/trackprovider.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchingComponent } from './searching/searching.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule } from '@angular/forms'; 

import { CancelService } from './cancel.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ReasonComponent } from './reason/reason.component';
const routes:Routes=[
  {path:'',component:TrackproviderComponent},
  {path:'trackProvider',component:TrackproviderComponent},
  {path:'searching',component:SearchingComponent},
  {path:'notFound',component:NotFoundComponent},
  {path:'reason',component:ReasonComponent}
]
@NgModule({
  declarations: [
    TrackproviderComponent,
    SearchingComponent,
    NotFoundComponent,
    ReasonComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    FormsModule
  ],
  providers: [CancelService]
})
export class ProviderdetailsModule { }
