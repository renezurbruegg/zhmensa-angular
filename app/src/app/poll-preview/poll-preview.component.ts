import { Component, OnInit, Input } from '@angular/core';
import { Poll, PollOption } from '../models/poll';
import { PollService } from '../poll.service';
import { MensaService } from '../_service/mensa-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-preview',
  templateUrl: './poll-preview.component.html',
  styleUrls: ['./poll-preview.component.scss']
})
export class PollPreviewComponent implements OnInit {

  @Input()
  public poll: Poll;

  max = 5

  previewOptions: Array<PollOption> = []

  previewList: Array<any> = [];

  constructor(public pollService: PollService, public mensaService: MensaService, public router: Router) { }

  ngOnInit() {
      this.updateTopVotes(this.poll);

      this.previewOptions.forEach((pollOption: PollOption) => {
        this.mensaService.getMenuForPollOption(this.poll, pollOption);
        let entry = {
          title: pollOption.mensaId + ": " + pollOption.menu.name,
          votes: pollOption.votes,
          pbValue: this.poll.votecount == 0 ? 0 : pollOption.votes/this.poll.votecount * 100
        }
        this.previewList.push(entry);
      })

  }


  navToPoll() {

    this.router.navigate(["/poll/"+this.poll.id]);
  }


  hidePoll(){
    this.pollService.removePollId(this.poll.id);
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
        this.previewOptions = allTopVotes.slice(0,Math.min(this.max, allTopVotes.length))

        console.log(this.previewOptions)
  }


}
