import { Component, OnInit } from '@angular/core';
import { Mensa } from '../models/mensa';
import { ActivatedRoute } from '@angular/router';
import { MensaService } from '../_service/mensa-service';
import { Menu } from '../models/menu';
import { Weekday } from '../models/weekday';
import { MealType } from '../models/mealtype';
import { MensaRouteService } from '../mensa-route.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-favorite-mensa',
  templateUrl: './favorite-mensa.component.html',
  styleUrls: ['./favorite-mensa.component.scss']
})
export class FavoriteMensaComponent implements OnInit {
  defaultFilter: (menu: Menu) => boolean;

  ngOnInit(): void {

    this.mensa = this.mensaService.getMensaContainingAllMenus();

    this.defaultFilter = this.mensaService.getFavoriteMenuFilter();

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

      this.mensaService.onMenuFavChanged$.subscribe( (id) => {
            this.filterStoredMensa(() => true);
      })

      console.log("fav list")
      console.log(this.mensaService.favoriteMenuIdList)
      if(this.mensaService.favoriteMenuIdList.length == 0) {
        let drawer = document.getElementById("toggleButton");
        console.log("drawer item")
        console.log(drawer)
        if(drawer)
          drawer.click();
      }

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
        this.mensaService.changeActiveMensa(this.mensa);


  }

  isSmallScreen: boolean = false;

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


    getDayLabel(day: Weekday) : string {
      return this.isSmallScreen ? this.mensaService.WEEKDAYS_SHORT[day.number] :  this.mensaService.WEEKDAYS_LONG[day.number]
    }

    loadMensa(id: number): void {
        this.mensa =  this.mensaService.getMensaForId(id);
    }

  constructor(private route: ActivatedRoute, private mensaService: MensaService, private mrs: MensaRouteService, public breakpointObserver: BreakpointObserver) {
  }

  getWeekdaysArr(mensa: Mensa) {
    return Object.values(mensa.weekdays)
  }

}
