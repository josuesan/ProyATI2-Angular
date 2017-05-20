import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { MsgService } from './msg.service';
import { LocalStorageService } from './localstorage.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = "3J's STORE";

  constructor(public servicio: MsgService, public serv: LocalStorageService) {
  }

}

