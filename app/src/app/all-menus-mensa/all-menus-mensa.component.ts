import { Component, OnInit } from '@angular/core';
import { Mensa } from '../models/mensa';
import { ActivatedRoute } from '@angular/router';
import { MensaService } from '../_service/mensa-service';
import { Menu } from '../models/menu';
import { Weekday } from '../models/weekday';
import { MealType } from '../models/mealtype';
import { MensaRouteService } from '../mensa-route.service';


@Component({
  selector: 'app-all-menus-mensa',
  templateUrl: './all-menus-mensa.component.html',
  styleUrls: ['./all-menus-mensa.component.scss']
})
export class AllMenusMensaComponent implements OnInit {
  defaultFilter: (menu: Menu) => boolean;


  ngOnInit(): void {

    this.mensa = this.mensaService.getMensaContainingAllMenus();

    this.defaultFilter = this.mensaService.getDefaultMenuFilter();

    this.filterStoredMensa(() => true);

    this.mensaService.generalFilter$.subscribe(
      input => {
        if (!input) {
          return;
        }

        this.filterStoredMensa(
          ((menu: Menu) => {
            return ("" + menu.name + menu.description + menu.prices + menu.allergene).toLowerCase().includes((input + "").toLowerCase());
          }));
      });

      this.mensaService.onMenuHidden$.subscribe( () => {
        this.filterStoredMensa( () => true);
      })

  }



  mensa: Mensa;
  breakpoint: number;

  filterStoredMensa(filter: (menu: Menu) => boolean): void {
    Object.values(this.mensa.weekdays).forEach((day: Weekday) => {
      Object.values(day.mealTypes).forEach((type: MealType) => {
        type.menus = this.filterMenus(type._menus, filter);
      })
    })
  }

  filterMenus(menus: Array<Menu>, filter: (menu: Menu) => boolean): Array<Menu> {
    let filteredList: Array<Menu> = [];

    menus.forEach((menu: Menu, pos: number) => {
      if (filter(menu) && ((!this.defaultFilter || this.defaultFilter(menu)))) {
        filteredList.push(menu);
      }
    });

    return filteredList;
  }

  filter(menu: Menu): boolean {
    if (menu.mensa == "Tannenbar") {
      return true;
    }
    return false;
  }

  constructor(private route: ActivatedRoute, private mensaService: MensaService, private mrs: MensaRouteService) {
  }


    getWeekdaysArr(mensa: Mensa) {
      return Object.values(mensa.weekdays)
    }
}
