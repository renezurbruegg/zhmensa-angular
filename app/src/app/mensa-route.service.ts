import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MensaRouteService {

//  public slectedRouteI
  constructor(private route: ActivatedRoute) {
  }
  public getRouteInformation() {
    console.log(this.route);
  }
}
