import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.css'
})
export class InviteComponent {

  navToBack(){
    this.location.back();
  }

  constructor(private readonly location:Location)
  {

  }
}
