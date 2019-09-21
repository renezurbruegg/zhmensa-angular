import {MealType} from './mealtype';

export interface Weekday {
    label: String;
    number: number;
    mealTypes: Array<MealType>;
}
