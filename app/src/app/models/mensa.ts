import {Weekday} from './weekday';

export interface Mensa {
  name: String;
  navigationId?: number;
  category: String;
  isClosed: boolean;
  weekdays: Record<string, Weekday>;
}
