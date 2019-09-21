import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../models/menu';
import { MensaService } from '../_service/mensa-service';

@Component({
  selector: 'app-menu-card-component',
  templateUrl: './menu-card-component.component.html',
  styleUrls: ['./menu-card-component.component.scss']
})
export class MenuCardComponentComponent implements OnInit {

  @Input()
  public menu: Menu;
  public hasAllergene: boolean;

  constructor(private mensaService: MensaService) {

 }

   getMenuName() : String {
    if(this.mensaService.selectedMensaShowName) {
      return this.menu.mensa + ": " + this.menu.name;
    }
    return this.menu.name;
  }

  isFavorite(menu: Menu) : boolean {
    return this.mensaService.isFavorite(menu);
  };

  toggleFavorite(menu: Menu) {
    console.log(menu);
    if(this.isFavorite(menu)) {
      this.mensaService.removeFavoriteMenuId(menu.id);
    } else {
      this.mensaService.addFavoriteMenuId(menu.id);
    }
  }

  toggleExpandMenu(menu: Menu){
    menu.isExpanded = !menu.isExpanded;
  }

  hideMenu(menu: Menu) {
    this.mensaService.hideMenuId(menu.id);
    menu.isHidden = true;
  }

  ngOnInit() {
    if(this.menu.allergene) {
      this.hasAllergene = true;
    } else {
      this.hasAllergene = false;
    }
  }

}
