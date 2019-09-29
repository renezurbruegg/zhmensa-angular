import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../models/menu';
import {PollOption, Poll} from '../models/poll'
import { MensaService } from '../_service/mensa-service';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll-card-component',
  templateUrl: './poll-card-component.component.html',
  styleUrls: ['./poll-card-component.component.scss']
})
export class PollCardComponentComponent implements OnInit {

  @Input()
  public pollOption: PollOption;

  @Input()
  public poll: Poll;

  public hasAllergene: boolean;



  public menu: Menu;



  getPbValue() {
    if(this.poll.votecount == 0)
      return 0
    return this.pollOption.votes / this.poll.votecount * 100
  }

  ngOnInit(){
    console.log("got poll")
    console.log(this.pollOption)
    this.menu = this.mensaService.getMenuForPollOption(this.poll, this.pollOption);
  }

  constructor(private mensaService: MensaService, private pollService: PollService) {
 }

   getMenuName() : String {
      return this.menu.mensa + ": " + this.menu.name;
  }

  isFavorite(menu: Menu) : boolean {
    return this.mensaService.isFavorite(menu);
  };

  toggleVote() {
    this.pollService.performVote(this.poll, this.pollOption)
  }

  getPrices() {
    let ret : string = "";
    ["student", "staff", "extern"].forEach( (value:string) => {
      ret+= ret == "" ? "" : " / "
      ret += this.menu.prices[value];
    } )
    return ret;
  }


  toggleFavorite(menu: Menu) {
    console.log(menu);
    if(this.isFavorite(menu)) {
      this.mensaService.removeFavoriteMenuId(menu.id);
    } else {
      this.mensaService.addFavoriteMenuId(menu.id);
    }
  }

  toggleExpandMenu(menu: Menu){
    menu.isExpanded = !menu.isExpanded;
  }

  hideMenu(menu: Menu) {
    this.mensaService.hideMenuId(menu.id);
    menu.isHidden = true;
  }


}
