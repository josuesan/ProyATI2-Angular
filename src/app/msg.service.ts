import { Injectable } from '@angular/core';
import {Message} from 'primeng/primeng';

@Injectable()
export class MsgService {

  public msgs: Message[] = [];
  
}