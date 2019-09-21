import { Component, OnInit } from '@angular/core';
import { Menu } from '../models/menu';
import { Mensa } from '../models/mensa';
import { MealType } from '../models/MealType';
import { Weekday } from '../models/weekday';
import { ActivatedRoute } from '@angular/router';
import { MensaService } from '../_service/mensa-service';

@Component({
  selector: 'app-mensa-component',
  templateUrl: './mensa-component.component.html',
  styleUrls: ['./mensa-component.component.scss']
})
export class MensaComponentComponent implements OnInit{

  ngOnInit(): void {

    this.loadMensa(0)


  	this.route.params.subscribe(routeParams => {
  		this.loadMensa(routeParams.id);
  	});

  }

  mensa: Mensa;
  breakpoint: number;


  loadMensa(id: number): void {
      this.mensa =  this.mensaService.getMensaForId(id);
  }

  constructor(  private route: ActivatedRoute, private mensaService: MensaService) {
  }

}
