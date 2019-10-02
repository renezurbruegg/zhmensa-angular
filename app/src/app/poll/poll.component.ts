import { Component, OnInit } from '@angular/core';
import { Poll, PollOption } from '../models/poll';
import { PollService } from '../poll.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MensaService } from '../_service/mensa-service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {

  poll: Poll;
  poll$: Observable<Poll>;



  public previewOptions: Array<PollOption>;

  constructor(
     private pollService: PollService,
     private mensaService: MensaService,

     private route: ActivatedRoute,
     private router: Router) { }

  ngOnInit() {

  this.poll$ = this.route.paramMap.pipe(
    switchMap((params: ParamMap) =>
      this.pollService.getPollForId(params.get('id')))
  );

  this.poll$.subscribe((poll : Poll) => {
    this.poll = poll;
    this.pollService.addKnownPollId(poll.id);
    this.updateTopVotes(poll);
    this.previewOptions.forEach((pollOption: PollOption) => {
      this.mensaService.getMenuForPollOption(poll, pollOption);
    })

  });

  this.pollService.voteUpdateSubject$.subscribe( (poll: Poll) => {
    if(this.poll && this.poll.id == poll.id) {
      this.updateTopVotes(poll);
      this.previewOptions.forEach((pollOption: PollOption) => {
        this.mensaService.getMenuForPollOption(poll, pollOption);
      })
    }
  })
}

getPbValue(pollOption: PollOption) {
  return this.poll.votecount == 0 ? 0 : pollOption.votes / this.poll.votecount * 100;
}
updateTopVotes(poll: Poll) {
  console.log("got update top votes call")
      let allTopVotes : Array<PollOption> = [...poll.options];
      allTopVotes.sort((p1, p2) => {
        return p2.votes - p1.votes;
      })
      this.previewOptions = allTopVotes.slice(0,Math.min(3, allTopVotes.length))

      console.log(this.previewOptions)
}


printPoll(poll: Poll) {
  console.log("poll-")
  console.log(poll)
}

}
