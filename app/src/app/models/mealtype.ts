import { Menu } from './menu';

export interface MealType {
  label: String;
  menus: Array<Menu>;
  _menus?: Array<Menu>;
}
