import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MensaComponentComponent } from './mensa-component/mensa-component.component';
import { MealTypeComponent } from './meal-type/meal-type.component';
import { WeekdayComponent } from './weekday/weekday.component';
import {FavoriteMensaComponent} from './favorite-mensa/favorite-mensa.component';
import { AllMenusMensaComponent } from './all-menus-mensa/all-menus-mensa.component';
import { PollComponent } from './poll/poll.component';

const routes: Routes = [
  { path: 'all', component: AllMenusMensaComponent },
  { path: 'favorites', component: FavoriteMensaComponent },
  { path: 'mensa/:id', component: MensaComponentComponent },
  { path: 'poll/:id', component: PollComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
