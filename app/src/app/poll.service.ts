import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Poll, PollOption } from './models/poll';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  path: string = "http://mensazh.vsos.ethz.ch:8080/api/polls"; //?start=2019-09-23&end=2019-09-25";
  votedPollIdList: Array<String>;
  votedPollIdKey: string = "voted_poll_ids";

  knownPollKey:string = "known_poll_ids";

  knownPollIds: Array<String>;

  knownPollObj: Array<Poll>;


  public voteUpdateSubject: Subject<Poll> = new BehaviorSubject(null);
  voteUpdateSubject$ = this.voteUpdateSubject.asObservable();

    public onPollIdRemoved: Subject<String> = new BehaviorSubject("");
    onPollIdRemoved$ = this.onPollIdRemoved.asObservable();

  constructor(private http: HttpClient) {
    this.votedPollIdList = JSON.parse(localStorage.getItem(this.votedPollIdKey));

    if(!this.votedPollIdList) {
      this.votedPollIdList = [];
    }

    this.knownPollIds = JSON.parse(localStorage.getItem(this.knownPollKey));

    if(!this.knownPollIds) {
      this.knownPollIds = [];
    }
  }



  private hasUserVotedOnPollOption(option: PollOption, pollId: string) {
    let pollMenus = JSON.parse(localStorage.getItem(pollId));

    return (pollMenus && pollMenus.includes(option.menuId))

  }

  private toggleUserVotedOnPollOption(option: PollOption, pollId: string) {
    let pollMenus = JSON.parse(localStorage.getItem(pollId));

    if(!pollMenus) {
      pollMenus = [];
    }

    if(pollMenus.includes(option.menuId)) {
      // remove id
      for( var i = 0; i < pollMenus.length; i++){
        if (pollMenus[i] === option.menuId) {
         pollMenus.splice(i, 1);
       }
     }
     } else {
       pollMenus.push(option.menuId);
     }

     localStorage.setItem(pollId, JSON.stringify(pollMenus));
   }


  public getKnownPollIds() {
    //return ["5d8d1cd0c15862c781a6be27","5d8a2a51d6c3c05682274c76","5d8d1cd0c15862c781a6be27"];
    return this.knownPollIds;
  }

  public getKnownPollObj() : Promise<Array<Poll>> {

    return new Promise<Array<Poll>>((resolve, reject) => {
      // load host.json file
      this.http.post(this.path, {ids: this.getKnownPollIds()}).toPromise().then(
        (response: any) => {
          this.knownPollObj = response["polls"];

          resolve(this.knownPollObj);
        }
      ).catch((response: any) => {
        reject("Could not load mensa list " + response);
      });
    });
  }

  public addKnownPollId(pollId: String) {
    console.log("add known Poll id: " + pollId)
    console.log(this.knownPollIds)
    if(!this.knownPollIds.includes(pollId))
      this.knownPollIds.push(pollId)

    console.log(this.knownPollIds)
    localStorage.setItem(this.knownPollKey, JSON.stringify(this.knownPollIds));
  }


  removePollId(pollId: string){
      for( var i = 0; i < this.knownPollIds.length; i++){
        if (this.knownPollIds[i] === pollId) {
         this.knownPollIds.splice(i, 1);
       }
    }
    for( var i = 0; i < this.knownPollObj.length; i++){
      if (this.knownPollObj[i].id === pollId) {
       this.knownPollObj.splice(i, 1);
     }
  }
    this.onPollIdRemoved.next(pollId);
    console.log("removed")
    localStorage.setItem(this.knownPollKey, JSON.stringify(this.knownPollIds));

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
      this.toggleUserVotedOnPollOption(pollOption, poll.id);
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
      console.log("calling path" + this.path +"/vote/"+ poll.id)
      // load host.json file
      this.http.post(this.path + "/vote/" + poll.id, payload).toPromise().then(
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
      console.log("calling path" + this.path + "/" + id)
      // load host.json file
      this.http.get(this.path + "/" + id).toPromise().then(
        (response: Poll) => {
          console.log("response");
          console.log(response);
            for(let option of response.options){
              option.userVoted = this.hasUserVotedOnPollOption(option, response.id);
          }
          resolve(response);
        }
      ).catch((response: any) => {
        reject("Could not load mensa list " + response);
      });
    });
  }

}
