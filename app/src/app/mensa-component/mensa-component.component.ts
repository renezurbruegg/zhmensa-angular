import { Component, OnInit } from '@angular/core';
import { Menu } from '../models/menu';
import { Mensa } from '../models/mensa';
import { ActivatedRoute } from '@angular/router';
import { MensaService } from '../_service/mensa-service';
import { Weekday } from '../models/weekday';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

/**
Root Component to display a Mensa. Contains Weekday tabs.
*/
@Component({
  selector: 'app-mensa-component',
  templateUrl: './mensa-component.component.html',
  styleUrls: ['./mensa-component.component.scss']
})
export class MensaComponentComponent implements OnInit {

  isSmallScreen: boolean = false;


  mensa: Mensa;
  breakpoint: number;



  constructor(private route: ActivatedRoute, private mensaService: MensaService, public breakpointObserver: BreakpointObserver) {
  }

  /**
  Returns string for day tabs. If device has a small screen, [Mo, Di,...] will be returned instead of [Montag, Dienstag, ...]
  */
  public getDayLabel(day: Weekday): string {
    return this.isSmallScreen ? this.mensaService.WEEKDAYS_SHORT[day.number] : this.mensaService.WEEKDAYS_LONG[day.number]
  }

  private loadMensa(id: number): void {
    this.mensa = this.mensaService.getMensaForId(id);
  }


  ngOnInit(): void {
    //  this.loadMensa(0)

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        this.isSmallScreen = state.matches;
      });

    this.route.params.subscribe(routeParams => {
      this.loadMensa(routeParams.id);
    });

  }

  /**
  Returns avaiable weekdays as array to be able to iterate over it
  */
  getWeekdaysArr(mensa: Mensa) {
    return Object.values(mensa.weekdays)
  }
}
