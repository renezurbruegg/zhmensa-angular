export interface Menu {
  mensa: String;
  name: String;

  id : String;
  prices: Record<string,String>;
  description: any; //TODO change backend

  allergene?: Array<String>;
  isVegi: boolean;
  nutritionFacts?: String;
  isFavorite? : boolean;
    isHidden?: boolean;
    isExpanded? : boolean;
}
