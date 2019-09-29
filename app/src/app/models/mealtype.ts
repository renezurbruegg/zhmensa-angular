import { Menu } from './menu';

export interface MealType {
  label: string;
  menus: Array<Menu>;
  _menus?: Array<Menu>;
}
