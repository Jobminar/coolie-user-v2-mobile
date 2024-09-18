import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { DemoService } from '../services/demo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../models/dialogData';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
 
  @Input() content: string = '';
  constructor(public dialogRef: MatDialogRef<DemoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    
    this.content = data.content;
 
    setTimeout(()=>{
      this.onNoClick()
    },3000)
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}