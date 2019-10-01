

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { MatToolbarModule, MatProgressBarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatTabsModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCardModule} from '@angular/material/card';
import { MenuCardComponentComponent } from './menu-card-component/menu-card-component.component';
import { MensaComponentComponent } from './mensa-component/mensa-component.component';
import { WeekdayComponent } from './weekday/weekday.component';
import { MealTypeComponent } from './meal-type/meal-type.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {GridModule} from '@angular/flex-layout/grid';
import {MenuListItemComponent} from './menu-list-item/menu-list-item.component';
import { HttpClientModule } from '@angular/common/http';
import { MensaService } from './_service/mensa-service';
import { FavoriteMensaComponent } from './favorite-mensa/favorite-mensa.component';
import { NgMatSearchBarModule } from 'ng-mat-search-bar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllMenusMensaComponent } from './all-menus-mensa/all-menus-mensa.component';
import { MensaRouteService } from './mensa-route.service';
import { PollComponent } from './poll/poll.component';
import { PollOptionComponent } from './poll-option/poll-option.component';
import { PollCardComponentComponent } from './poll-card-component/poll-card-component.component';


import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';


export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

/**
* loads the config from the backend.
* Needs to be called before starting the rest of the application
*/
export function initializeApp(mensaService: MensaService) {
  return () => mensaService.load();
}


@NgModule({
  declarations: [
    AppComponent,
    MenuCardComponentComponent,
    MensaComponentComponent,
    WeekdayComponent,
    MealTypeComponent,
    MenuListItemComponent,
    FavoriteMensaComponent,
    AllMenusMensaComponent,
    PollComponent,
    PollOptionComponent,
    PollCardComponentComponent

  ],
  imports: [MatInputModule,
    BrowserModule,MatCardModule, HttpClientModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,MatGridListModule,MatTabsModule,
    AppRoutingModule,GridModule , BrowserAnimationsModule,ReactiveFormsModule, FormsModule,MatProgressBarModule,
  NgMatSearchBarModule],
  providers: [MensaService, MensaRouteService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    // Call initializeApp before application boots
  { provide: APP_INITIALIZER,  useFactory: initializeApp,  deps: [MensaService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
