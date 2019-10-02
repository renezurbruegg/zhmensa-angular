import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, timer, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NavItem } from './menu-list-item/nav-item';
import { MensaService } from './_service/mensa-service';
import { Mensa } from './models/mensa';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MensaRouteService } from './mensa-route.service';
import { Router, ActivatedRoute } from '@angular/router';



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

  childs: NavItem[] = [];


  public navItems: NavItem[] = [
  /*  {
      displayName: 'Alle ',
      iconName: 'list',
      route: '/all',
      loginRequired: false,
      children: []
    },*/ {
      displayName: 'Favoriten ',
      iconName: 'favorite',
      route: '/favorites',
      loginRequired: false,
      matIcon: true,
      children: []
    }


  ];

  /**
  * List containing all "big" dropdown navigation objects.
  */
  public routes: ROUTE[] = [
  ];

  public get isToggleEnabled() {
    return true;
  }


  private addMensaToNavigation(mensa: Mensa) {
    let parentItem: NavItem = null;

    for (let item of this.navItems) {
      if (item.displayName == mensa.category) {
        parentItem = item;
      }
    }

    if (parentItem == null) {
      parentItem = {
        displayName: mensa.category + "",
        pngIcon:true,
        iconName: mensa.category.includes("ETH")  ? "assets/ic_eth.png" : "assets/ic_uzh.png",
        route: '',
        loginRequired: false,
        children: []
      }
      this.navItems.push(parentItem);
    }

    let it = {
      displayName: mensa.name + "",
      iconName: 'food',
      route: '/mensa/' + mensa.navigationId,
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

  onSwipe(evt) {
      if(Math.abs(evt.deltaX) > 80) {

        if(this.mensaService.currentMensa) {
          console.log(this.mensaService.currentMensa)
            let id : number =  this.mensaService.currentMensa.navigationId;

            if(evt.deltaX < 0) {
              id+= 1;
              if(id == (this.mensaService.idToNameMapping.length- 1))
                return;
              // Right swipe
            } else {
              if(id == -1)
                return;
              if(id == 0) {
                  this.router.navigate(["/favorites"]);
                  return;
                }
              id-=1;
              // left swipe
            }
            this.router.navigate(["/mensa/"+id]);
        }
      }
   }

  constructor(private breakpointObserver: BreakpointObserver, private mensaService: MensaService, private fb: FormBuilder, private no: MensaRouteService, private router: Router, private activatedRoute: ActivatedRoute) {

    mensaService.selectedMensaName$.subscribe(data => {
      this.title = data;
      console.log("update " + data)
    });

    let mensaMap: Record<string, Mensa> = mensaService.getMensaMap();
    console.log(mensaMap);
    console.log(mensaService.getMensaNames());
    for (let name of mensaService.getMensaNames()) {
      this.addMensaToNavigation(mensaMap[name]);
    }
    this.navItems.push( {
      displayName: 'Umfragen',
      iconName: 'poll',
      route: '/poll',
      loginRequired: false,
      matIcon:true,
      children: []
    });


    this.searchForm.controls["searchCtrl"].valueChanges.subscribe(
      val => {
        console.log(val);
        mensaService.generalFilter.next(val);
      }
    )
  }
}
