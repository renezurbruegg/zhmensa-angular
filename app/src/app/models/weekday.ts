import {MealType} from './mealtype';

export interface Weekday {
    label: String;
    number: number;
    mealTypes: Record<string, MealType>;
    date: String;
}
