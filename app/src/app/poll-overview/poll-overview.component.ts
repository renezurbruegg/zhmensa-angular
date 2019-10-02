import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { Observable, from } from 'rxjs';
import { Poll } from '../models/poll';

@Component({
  selector: 'app-poll-overview',
  templateUrl: './poll-overview.component.html',
  styleUrls: ['./poll-overview.component.scss']
})
export class PollOverviewComponent implements OnInit {

  pollList$: Observable<Array<Poll>>;

  constructor(public pollService: PollService) { }

  ngOnInit() {
    this.pollList$ = from(this.pollService.getKnownPollObj());
    
  }

}
