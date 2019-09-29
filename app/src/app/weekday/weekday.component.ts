import { Component, OnInit, Input } from '@angular/core';
import { Weekday } from '../models/weekday';

@Component({
  selector: 'app-weekday',
  templateUrl: './weekday.component.html',
  styleUrls: ['./weekday.component.scss']
})
export class WeekdayComponent implements OnInit {

  @Input()
  day: Weekday;

  constructor() { }

  ngOnInit() {
  }

  getMealTypesArr(day : Weekday) {
    return Object.values(day.mealTypes);
  }

}
