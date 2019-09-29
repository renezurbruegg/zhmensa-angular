import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poll, PollOption } from './models/poll';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  path: string = "http://mensazh.vsos.ethz.ch:8080/api/polls/"; //?start=2019-09-23&end=2019-09-25";
  votedPollIdList: Array<String>;
  votedPollIdKey: string = "voted_poll_ids";


  public voteUpdateSubject: Subject<Poll> = new BehaviorSubject(null);
  voteUpdateSubject$ = this.voteUpdateSubject.asObservable();


  constructor(private http: HttpClient) {
    this.votedPollIdList = JSON.parse(localStorage.getItem(this.votedPollIdKey));

    if(!this.votedPollIdList) {
      this.votedPollIdList = [];
    }
  }

  hasUserVotedOnPoll(pollId: string) : boolean {
    return this.votedPollIdList.includes(pollId);
  }

  public addPollId(pollId: String) {
    this.votedPollIdList.push(pollId);
    localStorage.setItem(this.votedPollIdKey, JSON.stringify(this.votedPollIdList));
  }


  performVote(poll: Poll, pollOption:PollOption) {
    let update : boolean = this.hasUserVotedOnPoll(poll.id);


    this.performVoteCall(poll, pollOption, update).then( (response:any) => {
      this.addPollId(poll.id);

      if(!update && ! pollOption.userVoted) {
        poll.votecount += 1;
      }

      if(pollOption.userVoted) {
        pollOption.votes-=1;
      }
      else {
        pollOption.votes += 1;
      }
      pollOption.userVoted = !pollOption.userVoted;

      this.voteUpdateSubject.next(poll);
    }
  )


  }


  performVoteCall(poll: Poll, pollOption: PollOption, update: boolean){
    let payload: any = {};
    let voteId: any = {};
    voteId["mensaId"] = pollOption.mensaId;
    voteId["menuId"] = pollOption.menuId;
    voteId["voteType"] = pollOption.userVoted ? "negative" : "positive";

    payload["votes"] = [voteId];
    payload["update"] = update;

    console.log("updating poll")
    console.log(JSON.stringify(payload));

    return new Promise<Poll>((resolve, reject) => {
      console.log("calling path" + this.path +"vote/"+ poll.id)
      // load host.json file
      this.http.post(this.path + "vote/" + poll.id, payload).toPromise().then(
        (response: any) => {
          console.log("response");
          console.log(response);
          resolve(response);
        }
      ).catch((response: any) => {
        reject("Could not load mensa list " + response);
      });
    });
  }

  getPollForId(id : string) {
    return new Promise<Poll>((resolve, reject) => {
      console.log("calling path" + this.path + id)
      // load host.json file
      this.http.get(this.path + id).toPromise().then(
        (response: Poll) => {
          console.log("response");
          console.log(response);
          resolve(response);
        }
      ).catch((response: any) => {
        reject("Could not load mensa list " + response);
      });
    });
  }

}
