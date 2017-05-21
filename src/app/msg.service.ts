import { Injectable } from '@angular/core';
import {Message} from 'primeng/primeng';
import {Location} from '@angular/common';

@Injectable()
export class MsgService {

  public msgs: Message[] = [];
  constructor(private _location: Location) {}
  backClicked() {
        this._location.back();
  }
  
}