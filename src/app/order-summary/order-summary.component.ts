import { Component } from '@angular/core';
import { MyCartService } from '../services/my-cart.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent {
      amount:number=230;
      subCategoryVarient:any=[];
      constructor(private readonly mycartService:MyCartService){
        
      }
      ngOnInit(): void {
        const userId :any=localStorage.getItem('userId')
        this.mycartService.getCartItems(userId).subscribe(
          (response)=>{
            console.log(response);
            this.subCategoryVarient=response[0].items
          },(error)=>{
            console.log(error);
          }
        )
      }
      expandedIndex: number | null = null;
    expand(index: number): void {
      if (this.expandedIndex === index) {
        this.expandedIndex = null; // Collapse if the same index is clicked
      } else {
        this.expandedIndex = index; // Expand the new index
      }
    }
}
