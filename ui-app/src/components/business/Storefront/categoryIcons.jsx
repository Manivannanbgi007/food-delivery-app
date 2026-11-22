import {
  CakeSlice,
  Coffee,
  CookingPot,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  UtensilsCrossed,
} from 'lucide-react';

/** An icon per category, for one without a picture or whose picture cannot be loaded. */
const ICONS = {
  Pizza,
  Burgers: Sandwich,
  Biryani: CookingPot,
  Chinese: Soup,
  'South Indian': Salad,
  'North Indian': CookingPot,
  Desserts: CakeSlice,
  Beverages: Coffee,
};

/** The icon of a food category; an unknown category gets a plate. */
export function CategoryIcon({ name, className }) {
  const Icon = ICONS[name] ?? UtensilsCrossed;
  return <Icon aria-hidden="true" className={className} />;
}
