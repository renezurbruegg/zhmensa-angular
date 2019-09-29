import { Menu } from './menu';

export interface Poll {
  title: string;
  mealType: string;
  weekday: number;
  votecount: number;
  id: string;
  options:Array<PollOption>;
}

export interface PollOption {
  mensaId: string;
  menuId: string;
  userVoted: boolean;
  votes: number;
  menu?:Menu;
}
