import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../models/menu';
import { MealType } from '../models/mealtype';

@Component({
  selector: 'app-meal-type',
  templateUrl: './meal-type.component.html',
  styleUrls: ['./meal-type.component.scss']
})
export class MealTypeComponent implements OnInit {
    minWidth: number = 400;
    menu: Menu;
    breakpoint: number;

    @Input()
    public meal: MealType;

    constructor() {
    }



      ngOnInit() {
        this.breakpoint = this.getColNumbs(window.innerWidth);
      }

      onResize(event) {
        console.log(event.target.innerWidth);
        this.breakpoint = this.getColNumbs(event.target.innerWidth);
      }

      getColNumbs(width: number) : number {
        return Math.max(Math.min(6, width / 400), 1);
      }
}
