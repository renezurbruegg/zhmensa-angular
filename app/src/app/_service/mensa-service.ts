import { Injectable } from '@angular/core';

import { Menu } from '../models/menu';
import { Mensa } from '../models/mensa';
import { MealType } from '../models/MealType';
import { Weekday } from '../models/weekday';


import { HttpClient } from '@angular/common/http';
import { from, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})




export class MensaService {

    public selectedMensaShowName: boolean = false;

    currentMensa: Mensa;

    path: string = "http://localhost:8080/api/getAllMensas";

    favKey: string = "favoriteList";
    hideKey:string = "hideList";

    mensaList: Record<string, Mensa>;

    idToNameMapping: Array<string> = [];

    public selectedMensaName: Subject<any> = new BehaviorSubject(false);
    selectedMensaName$ = this.selectedMensaName.asObservable();


    public generalFilter: Subject<any> = new BehaviorSubject(false);
    generalFilter$ = this.generalFilter.asObservable();

    public onMenuHidden: Subject<any> =  new BehaviorSubject(false);
    onMenuHidden$ = this.onMenuHidden.asObservable();

    public onMenuFavChanged: Subject<any> =  new BehaviorSubject(false);
    onMenuFavChanged$ = this.onMenuFavChanged.asObservable();


    favoriteMenuIdList : Array<String> = [];
    hiddenMenuIdList : Array<String> = [];

    favoriteMensa : FavoriteMensa = new FavoriteMensa();


    public removeFavoriteMenuId(menuId: String) {
      console.log("remove")
        for( var i = 0; i < this.favoriteMenuIdList.length; i++){
          if (this.favoriteMenuIdList[i] === menuId) {
           this.favoriteMenuIdList.splice(i, 1);
         }
      }
      this.onMenuFavChanged.next(menuId);
      console.log("removed")
      localStorage.setItem(this.favKey, JSON.stringify(this.favoriteMenuIdList));

    }

    public addFavoriteMenuId(menuId: String) {
      this.favoriteMenuIdList.push(menuId);
      this.onMenuFavChanged.next(menuId);
      localStorage.setItem(this.favKey, JSON.stringify(this.favoriteMenuIdList));
    }

    public isFavorite(menu: Menu) : boolean {
      return this.favoriteMenuIdList.includes(menu.id);
    }


    public hideMenuId(menuId: String) {
      this.hiddenMenuIdList.push(menuId);
      localStorage.setItem(this.hideKey, JSON.stringify(this.hiddenMenuIdList));
      this.onMenuHidden.next(menuId);
    }

    public getMensaContainingAllMenus() : Mensa {
      this.selectedMensaShowName = true;
      return this.favoriteMensa;
    }

    public getDefaultMenuFilter() : (Menu) => boolean {
      return (menu: Menu) => {
        return  !this.hiddenMenuIdList.includes(menu.id);
      }
    }

    public getFavoriteMenuFilter() : (Menu) => boolean {
      return (menu: Menu) => {
        return this.favoriteMenuIdList.includes(menu.id);
      }
    }
      /**
      * Loads the config from the backend and stores it in the settings object <br>
      * @return a Promise that is resolved as soon as the config is loaded
      */
      public load() {
        console.log("load called")
        return new Promise<void>((resolve, reject) => {
          // load host.json file
          this.http.get(this.path).toPromise().then(
            (response: Record<string,Mensa>) => {
              this.mensaList = response;

              for(let name in this.mensaList ){
                this.mensaList[name].navigationId = this.idToNameMapping.length;
                this.idToNameMapping.push(name);
                this.addMenusToFavoriteMensa(this.mensaList[name]);
              }

              this.favoriteMensa.weekdays.forEach( (day: Weekday) => {
                day.mealTypes.forEach( (type: MealType) => {
                  type._menus = type.menus;
                });
              });

              resolve();
            }
          ).catch((response: any) => {
            reject("Could not load mensa list " + response);
          });
        });
      };

    constructor(private http: HttpClient) {
      console.log("mensa service constructor");

      this.hiddenMenuIdList = JSON.parse(localStorage.getItem(this.hideKey));
      this.favoriteMenuIdList = JSON.parse(localStorage.getItem(this.favKey));
      if(!this.hiddenMenuIdList) {
        this.hiddenMenuIdList = [];
      }

      if(!this.favoriteMenuIdList){
          this.favoriteMenuIdList = [];
      }
      console.log("got lists");
      console.log(this.favoriteMenuIdList);
      console.log(this.hiddenMenuIdList);

      this.generalFilter$.subscribe( filter => {
        if(this.currentMensa) {
          this.filter(this.currentMensa, false, (menu: Menu) =>
        {
            return !filter || ("" + menu.name + menu.description + menu.prices + menu.allergene).toLowerCase().includes((filter + "").toLowerCase());
        });
        }
      })
  }

  addMenusToFavoriteMensa(mensa: Mensa) : void{
    console.log("adding all menus to favorite mensa");
    mensa.weekdays.forEach((day : Weekday, index : number) => {
      let favoriteMensaDay = this.favoriteMensa.weekdays[day.number];

      for(let mealtype of day.mealTypes) {
        let label = mealtype.label;
        favoriteMensaDay.mealTypes.forEach( (type: MealType, position: number) => {
          if (label == type.label) {
            console.log("found matching mealtype");
            type.menus = type.menus.concat(mealtype.menus);
          }
        });
      }
    });
    console.log(this.favoriteMensa);
  }

  getMensaForId(id: number) {

      this.currentMensa =  this.mensaList[this.idToNameMapping[id]];

      this.filter(this.currentMensa, true, this.getDefaultMenuFilter());

      this.selectedMensaShowName = false;
      this.selectedMensaName.next(this.currentMensa.name);

      return this.currentMensa;
  }

  getMensaMap() {
    return this.mensaList;
  }

  public filter(mensa:Mensa, initMenus:boolean , filter: (menu:Menu) => boolean) {
    mensa.weekdays.forEach((day: Weekday) => {
      day.mealTypes.forEach((type: MealType) => {
        if(initMenus) {
          type._menus = type.menus;
        }
        type.menus = this.filterMenus(type._menus, filter);
      })
    })
  }

  filterMenus(menus: Array<Menu>, filter: (menu: Menu) => boolean): Array<Menu> {
    let filteredList: Array<Menu> = [];

    menus.forEach((menu: Menu, pos: number) => {
      if (filter(menu)) {
        filteredList.push(menu);
      }
    });

    return filteredList;
  }


}

  class DummyMensa implements Mensa {
    name: String;
    category: String;
    isClosed: boolean;
    weekdays: Weekday[];

    constructor(name: String) {
      this.name = name;
      this.isClosed = false;
      this.weekdays = [];
      this.category = "None";
      ["Mo", "Di", "Mi", "Do", "Fr"].forEach ( (label:string, pos: number) => {
        this.weekdays.push(new DummyWeekday(label, pos));
      });
    }
  }


  class DummyMenu implements Menu {
    mensa: String = "Dummy";
    name: String = "Dummy";;
    id: String = "Dummy";;
    prices: String = "8.50, 9.50, 10.50";;
    description: String = "Chili Bacon Cheeseburger \nSesam Bun, Beefburger \noder Vegi-Burger, Lattich, \nCheddar, Zwiebeln, Jalapenos,\nSpeck und Chilisauce\nPommes frites";
    allergene?: Array<String>;
    isVegi: boolean = false;
    nutritionFacts?: String;


    constructor(numb: any) {
      this.name = this.name + ' : ' + numb;
    }

   }


   class FavoriteMensa implements Mensa {
     name: String;
     category: String;
     isClosed: boolean;
     weekdays: Weekday[];

     constructor() {
       this.name = "Favorites";
       this.isClosed = false;
       this.weekdays = [];
       this.category = "None";
       ["Mo", "Di", "Mi", "Do", "Fr"].forEach ( (label:string, pos: number) => {
         this.weekdays.push(new DummyWeekday(label, pos));
       });

     }

   }

  class DummyMealtype implements MealType {

    label: String;
    menus: Menu[];

    constructor(label:string) {
      this.label = label;
      this.menus = [];
    }


  }

  class DummyWeekday implements Weekday {
    label: String;
    mealTypes: MealType[];
    number: number;

    constructor(dayName: String, number:number) {
      this.label = dayName;
      this.number = number;
      this.mealTypes = [];
      for (let i of ["lunch", "dinner"]) {
          this.mealTypes.push(new DummyMealtype(i));

    }
  }
}
