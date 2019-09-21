export interface Menu {
  mensa: String;
  name: String;

  id : String;
  prices: String;
  description: String;

  allergene?: Array<String>;
  isVegi: boolean;
  nutritionFacts?: String;
  isFavorite? : boolean;
    isHidden?: boolean;
    isExpanded? : boolean;
}
