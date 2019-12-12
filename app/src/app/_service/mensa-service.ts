import { Injectable } from '@angular/core';

import { Menu } from '../models/menu';
import { Mensa } from '../models/mensa';
import { MealType } from '../models/mealtype';
import { Weekday } from '../models/weekday';


import { HttpClient } from '@angular/common/http';
import { from, Subject, BehaviorSubject } from 'rxjs';
import { Poll, PollOption } from '../models/poll';

@Injectable({
  providedIn: 'root',
})



/**
Main Service. Provides access to all Mensa instances.
*/
export class MensaService {

    public WEEKDAYS_LONG = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]
    public WEEKDAYS_SHORT =["Mo", "Di","Mi", "Do", "Fr"]
    /**
    Flag that is set if the mensa that is currently selected has menüs that needs to show the Mensa name
    e.g. Favorite Mensa, All Menus Mensa
    */
    public selectedMensaShowName: boolean = false;


    public lang = "de";
    /**
    Mensa that is currently selected.
    */
    currentMensa: Mensa;

    /**
    API Path to get mensa items from backend
    */
    path: string = "http://mensazh.vsos.ethz.ch:8080/api/"

    resource:string = "/all/getMensaForCurrentWeek"; //?start=2019-09-23&end=2019-09-25";

    /**
    Key to obtain favorites stored in browser
    */
    favKey: string = "favoriteList";

    /**
    Key to obtain hidden menu ids stored in browser
    */
    hideKey:string = "hideList";

    /**
    Map containing mapping <mensaId <-> Mensa Object >
    */
    mensaList: Record<string, Mensa>;

    /**
    Maps id (supplied in url) to a Mensa Id
    */
    idToNameMapping: Array<string> = [];

    /**
    contains all loaded dates in format yyyy-mm-dd
    */
    public dateArray: Array<string> = [];

    /**
      The first date that was laoded (Monday)
    */
    public startDate : string;
    /**
      The end date that was laoded (Friday)
    */
    endDate: string;


    /**
    Subject that gets updated when a new mensa is selected
    */
    public selectedMensaName: Subject<any> = new BehaviorSubject(false);
    selectedMensaName$ = this.selectedMensaName.asObservable();

    /**
    Subject that gets triggered if the user enters something in the searchbar
    */
    public generalFilter: Subject<any> = new BehaviorSubject(false);
    generalFilter$ = this.generalFilter.asObservable();

    /**
    Subject that gets triggered if the user presses the hide button on a menu card
    */
    public onMenuHidden: Subject<any> =  new BehaviorSubject(false);
    onMenuHidden$ = this.onMenuHidden.asObservable();

    /**
    Subject that gets triggered if the user presses the favorite button on a menu card.
    */
    public onMenuFavChanged: Subject<any> =  new BehaviorSubject(false);
    onMenuFavChanged$ = this.onMenuFavChanged.asObservable();

    /**
    List containing all menu ids that are marked as favorites
    */
    favoriteMenuIdList : Array<String> = [];
    /**
    List containing all menu ids that are marked as hidden
    */
    hiddenMenuIdList : Array<String> = [];

    /**
    Mensa that contains all favorite Menus
    */
    favoriteMensa : FavoriteMensa;


    constructor(private http: HttpClient) {
      let date:Date = new Date();

      this.lang = localStorage.getItem("pref-language");
      this.lang = this.lang || "de"
      
      let day = date.getDay();

      if(day == 0) {
        date.setDate(date.getDate() + 1);
      } else if(day == 6) {
        date.setDate(date.getDate() + 2)
      } else {
        date.setDate(date.getDate() + ( 1 - day))
      }

      this.startDate = date.toISOString().slice(0,10);
      this.dateArray.push(this.startDate)
      date.setDate(date.getDate() + 1);

      for (let i = 1; i < 4; i++) {
          this.dateArray.push(date.toISOString().slice(0,10))
          date.setDate(date.getDate() + 1);
      }
      this.endDate = date.toISOString().slice(0,10)
      this.dateArray.push(this.endDate)
      // Date array contains all dates for which menus will be loaded

        this.resource = this.resource + "?start="+this.startDate + "&end="+this.endDate;
      // add start and end timestamps to path

      this.favoriteMensa = new FavoriteMensa(this.dateArray);

      //Load stored favorites and hidden menu ids

      this.hiddenMenuIdList = JSON.parse(localStorage.getItem(this.hideKey));
      this.favoriteMenuIdList = JSON.parse(localStorage.getItem(this.favKey));

      if(!this.hiddenMenuIdList) {
        this.hiddenMenuIdList = [];
      }

      if(!this.favoriteMenuIdList){
          this.favoriteMenuIdList = [];
      }

      // Creates filter for search bar (top right)
      this.generalFilter$.subscribe( filter => {
        if(this.currentMensa) {
          this.filter(this.currentMensa, false, (menu: Menu) =>
        {
            return !filter || filter =="" || ("" + menu.name + menu.description + menu.prices + menu.allergene).toLowerCase().includes((filter + "").toLowerCase());
        });
        }
      })
    }


    /**
    Returns the Menu item that belongs to a given pollOption and Poll.
    If no matching menu is found, the function will return a dummy implementation
    */
    public getMenuForPollOption(poll: Poll, pollOption: PollOption) : Menu {
        let dateStr = this.dateArray[poll.weekday];
        if(!pollOption.menu)
          pollOption.menu = this.getMenuForMensaAndId(pollOption.mensaId, pollOption.menuId, poll.mealType, dateStr);
        return pollOption.menu;
    }

    /**
    */
    private getMenuForMensaAndId(mensaId: string, menuId: string, mealType: string, weekday:string) : Menu{
      if(this.mensaList.hasOwnProperty(mensaId)) {
        let mensa : Mensa = this.mensaList[mensaId];
        if(mensa.weekdays.hasOwnProperty(weekday)) {
          let day: Weekday = mensa.weekdays[weekday];
          if(day.mealTypes.hasOwnProperty(mealType.toLowerCase())) {
            let mealTypeObj : MealType = day.mealTypes[mealType.toLowerCase()];
            for(let menu of mealTypeObj.menus) {
              if(menu.id == menuId) {
                return menu;
              }
            }
          }
        }
      }
      return new DummyMenu(mensaId + " - " + menuId);

    }

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

    /**
    Returns a function that matches all menus that are not hidden
    */
    public getDefaultMenuFilter() : (Menu) => boolean {
      return (menu: Menu) => {
        return  !this.hiddenMenuIdList.includes(menu.id);
      }
    }


  public getMensaNames(){
    return this.idToNameMapping;
  }
    /**
    Returns a function that matches all menus that are markes as favorites
    */
    public getFavoriteMenuFilter() : (Menu) => boolean {
      return (menu: Menu) => {
        return this.favoriteMenuIdList.includes(menu.id);
      }
    }

    private getMensaNamesOrdered(map: Record<string,Mensa>) : Array<string> {
      let ret : Array<string>= [];
      let cat: Record<string,Array<string>> = {
        "ETH-Zentrum" : [],
        "ETH-Hönggerberg" : [],
        "UZH-Zentrum": [],
        "UZH-Irchel": []
      };

      for(let name in map ){
        let mensa: Mensa = map[name];

        if(cat.hasOwnProperty(mensa.category+"")) {
          cat[mensa.category+""].push(name)
        } else {
            cat[mensa.category+""] = [name]
        }
      }

      for(let category in cat) {
        cat[category].sort()
        ret = ret.concat(cat[category]);
      }

      return ret;
    }
      /**
      * Loads all mensas from the API
      * @return a Promise that is resolved as soon as the mensas are loaded
      */
      public load() {
        return new Promise<void>((resolve, reject) => {
          let link = this.path+this.lang+this.resource;
          this.http.get(link).toPromise().then(
            (response: Record<string,Mensa>) => {
              this.mensaList = response;
              this.idToNameMapping = this.getMensaNamesOrdered(this.mensaList);

              for (var _i = 0; _i < this.idToNameMapping.length; _i++) {
                this.mensaList[this.idToNameMapping[_i]].navigationId = _i;
            //    this.idToNameMapping.push(name);
                this.addMenusToFavoriteMensa(this.mensaList[this.idToNameMapping[_i]]);
              }


              Object.values(this.favoriteMensa.weekdays).forEach( (day: Weekday) => {
                Object.values(day.mealTypes).forEach( (type: MealType) => {
                  // Create hidden copy. _menus contains all unfiltered menus. type.menus will contain all menus that match the filter.
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




  /**
  Adds an array of mealtypes to a given day.
  Function is used to copy menus from loaded mensas to favorite mensa
  */
  addMenusToWeekday(day: Weekday, mealTypes: Array<MealType>) {
    mealTypes.forEach( (mealtype: MealType) => {
      let label = mealtype.label;
      if(day.mealTypes.hasOwnProperty(label)) {
        day.mealTypes[label].menus = day.mealTypes[label].menus.concat(mealtype.menus);
      } else {
        console.log("mealtype " + label + " not found in favorite mensa")
        day.mealTypes[label] = mealtype;
      }
    })
  }


  /**
  Adds all menus to the favorite mensa
  */
  addMenusToFavoriteMensa(mensa: Mensa) : void {
    for(let dayStr of this.dateArray) {
        if (mensa.weekdays.hasOwnProperty(dayStr)) {
          let day: Weekday =  mensa.weekdays[dayStr];
          if(this.favoriteMensa.weekdays.hasOwnProperty(dayStr)) {
            this.addMenusToWeekday(this.favoriteMensa.weekdays[dayStr], Object.values(day.mealTypes));
          } else {
            this.favoriteMensa.weekdays[dayStr] = day;
          }
        }
    }
  }


  public changeActiveMensa(mensa : Mensa) {
    this.currentMensa = mensa;
    console.log("change active mensa")
    this.selectedMensaName.next(this.currentMensa.name);

  }

  /**
  Returns a mensa for a given id (used in browser URL)
  */
  getMensaForId(id: number) {

      this.selectedMensaShowName = false;
      this.changeActiveMensa(this.mensaList[this.idToNameMapping[id]])

      this.filter(this.currentMensa, true, this.getDefaultMenuFilter());


      return this.currentMensa;
  }

  getMensaMap() {
    return this.mensaList;
  }

  /**
  Filters the menus of a given mensa and modifies the mensa.menus property.
  if initMenus is set to true, the menus that are currently visible will be stored in the _menus property
  and menus that are currently not visible will be removed from this mensa.
  */
  public filter(mensa:Mensa, initMenus:boolean , filter: (menu:Menu) => boolean) {
    Object.values(mensa.weekdays).forEach((day: Weekday) => {
      Object.values(day.mealTypes).forEach((type: MealType) => {
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

  getDummyMenu(numb: number) {
    return new DummyMenu(numb);
  }


  updateLang(lang: string) {
     localStorage.setItem("pref-language", lang);
     this.lang = lang;
  }
}

/*
  class DummyMensa implements Mensa {
    name: String;
    category: String;
    isClosed: boolean;
    weekdays: Record<string, Weekday>;

    constructor(name: String) {
      this.name = name;
      this.isClosed = false;
      this.weekdays = {};
      this.category = "None";
      ["Mo", "Di", "Mi", "Do", "Fr"].forEach ( (label:string, pos: number) => {
        this.weekdays[label] = new DummyWeekday(label, pos);
      });
    }
  }
*/


  class DummyMenu implements Menu {
    mensa: String = "Dummy";
    name: String = "Dummy";
    id: String = "Dummy";
    prices: Record<string,String> = {student: "8.50", staff:"9.50", extern: "10.50"};
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
     weekdays: Record<string, Weekday>;
     navigationId: number;

     constructor(dateArray: Array<string>) {
       this.name = "Favorites";
       this.isClosed = false;
       this.weekdays = {};
       this.category = "None";
       this.navigationId = -1;
       ["Mo", "Di", "Mi", "Do", "Fr"].forEach ( (label:string, pos: number) => {
         this.weekdays[dateArray[pos]] = new DummyWeekday(label, pos);
       });
     }
   }


  class DummyMealtype implements MealType {

    label: string;
    menus: Menu[];

    constructor(label:string) {
      this.label = label;
      this.menus = [];
    }

  }

  class DummyWeekday implements Weekday {
    label: String;
    mealTypes: Record<string, MealType>;
    number: number;
    date:String;

    constructor(dayName: String, number:number) {
      this.date = "?"
      this.label = dayName;
      this.number = number;
      this.mealTypes = {};
      for (let i of ["lunch", "dinner"]) {
          this.mealTypes[i] = new DummyMealtype(i);
    }
  }
}
