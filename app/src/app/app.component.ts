import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, timer, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NavItem } from './menu-list-item/nav-item';
import { MensaService } from './_service/mensa-service';
import { Mensa } from './models/mensa';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MensaRouteService } from './mensa-route.service';



interface ROUTE {
  icon?: string;
  route?: string;
  title?: string;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
   searchForm = new FormGroup({
    searchCtrl: new FormControl('')
  });



  public title: string = "Title";

  childs : NavItem[] = [];


  public navItems: NavItem[] = [
    {
     displayName: 'Alle ',
     iconName: 'list',
     route: '/all',
     loginRequired: false,
     children: []
   },     {
      displayName: 'Favoriten ',
      iconName: 'favorite',
      route: '/favorites',
      loginRequired: false,
      children: []
    }


  ];

  /**
  * List containing all "big" dropdown navigation objects.
  */
  public routes: ROUTE[] = [
  ];




private addMensaToNavigation(mensa: Mensa) {
  let parentItem: NavItem = null;

  for (let item of this.navItems) {
    if (item.displayName == mensa.category) {
      parentItem = item;
    }
  }

  if(parentItem == null) {
      parentItem = {
       displayName: mensa.category + "",
       iconName: '',
       route: '',
       loginRequired: false,
       children: []
     }
     this.navItems.push(parentItem);
  }

  let it =  {
    displayName: mensa.name + "",
    iconName: 'food',
    route: '/mensa/'+ mensa.navigationId,
    loginRequired: false,
  };
  parentItem.children.push(it)
}
  /**
* Observable that gets triggered if screen size changes.  <br>
* True if device is handset and toggle button is shown.
*/
public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  test() {
    console.log("test called");
  }
  constructor(private breakpointObserver: BreakpointObserver, private mensaService: MensaService, private fb: FormBuilder, private no : MensaRouteService) {

      mensaService.selectedMensaName$.subscribe(data => {
        this.title = data;
        console.log("update " + data)
      });

      let mensaMap : Record<string,Mensa> = mensaService.getMensaMap();
      console.log(mensaMap);

      for(let name in mensaMap) {
        this.addMensaToNavigation(mensaMap[name]);
      }


      this.searchForm.controls["searchCtrl"].valueChanges.subscribe(
        val => {
          console.log(val);
          mensaService.generalFilter.next(val);
          }
      )

/*
      mensaService.loadedMensas$.subscribe( (mensa: Mensa) => {

          let parentItem: NavItem = null;

          for (let item of this.navItems) {
            if (item.displayName == mensa.category) {
              parentItem = item;
            }
          }

          if(parentItem == null) {
              parentItem = {
               displayName: mensa.category + "",
               iconName: '',
               route: '',
               loginRequired: false,
               children: []
             }
             this.navItems.push(parentItem);
          }

          let it =  {
            displayName: mensa.name + "",
            iconName: 'food',
            route: '/mensa/'+ (parentItem.children.length),
            loginRequired: false,
          };
          parentItem.children.push(it)

      });
    ;
      for (let item of this.navItems) {
        item.children = [];
        /*
          for(let i of [1,2,3,4,5,6,7,8,9]) {

          let it =  {
            displayName: 'Mensa ' + i,
            iconName: 'food',
            route: '/mensa/'+i,
            loginRequired: false,
          };

          item.children.push(it);
        }*/

  }
}
