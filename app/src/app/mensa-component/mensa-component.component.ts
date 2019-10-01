import { Component, OnInit } from '@angular/core';
import { Menu } from '../models/menu';
import { Mensa } from '../models/mensa';
import { ActivatedRoute } from '@angular/router';
import { MensaService } from '../_service/mensa-service';
import { Weekday } from '../models/weekday';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-mensa-component',
  templateUrl: './mensa-component.component.html',
  styleUrls: ['./mensa-component.component.scss']
})
export class MensaComponentComponent implements OnInit{

  isSmallScreen : boolean = false;

  ngOnInit(): void {

    this.loadMensa(0)

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log(
            'Matches small viewport or handset in portrait mode'
          );

        }
          this.isSmallScreen = state.matches;
      });

  	this.route.params.subscribe(routeParams => {
  		this.loadMensa(routeParams.id);
  	});

  }

  mensa: Mensa;
  breakpoint: number;



  getDayLabel(day: Weekday) : string {
    return this.isSmallScreen ? this.mensaService.WEEKDAYS_SHORT[day.number] :  this.mensaService.WEEKDAYS_LONG[day.number]
  }

  loadMensa(id: number): void {
      this.mensa =  this.mensaService.getMensaForId(id);
  }

  constructor(  private route: ActivatedRoute, private mensaService: MensaService, public breakpointObserver: BreakpointObserver) {
  }


    getWeekdaysArr(mensa: Mensa) {
      return Object.values(mensa.weekdays)
    }
}
