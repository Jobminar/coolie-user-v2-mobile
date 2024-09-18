
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DemoComponent } from '../demo/demo.component';
import { DialogData } from '../../models/dialogData';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor(private dialog: MatDialog) {}

  openDialog( content: string) {
    const dialogData: DialogData = {content };
    
    this.dialog.open(DemoComponent, {
      width: '100%',
      height: 'auto',
      panelClass: 'bottom-dialog-container',
      data: dialogData // Pass data here
    });
  }
}
