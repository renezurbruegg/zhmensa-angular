import { Component, OnInit, Input } from '@angular/core';
import { PollOption } from '../models/poll';

@Component({
  selector: 'app-poll-option',
  templateUrl: './poll-option.component.html',
  styleUrls: ['./poll-option.component.scss']
})
export class PollOptionComponent implements OnInit {

  @Input()
  pollOption: PollOption;

  constructor() { }

  ngOnInit() {
  }

}
