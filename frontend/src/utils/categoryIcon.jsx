import {
  Utensils,
  Film,
  GraduationCap,
  Home,
  ShoppingCart,
  Wallet,
  PiggyBank,
  Landmark,
  Car,
  Hospital,
  HelpCircle,
  FileText,
  CircleDollarSign,
  PhoneCall
} from "lucide-react";

export const CATEGORY_ICONS = {
  food: Utensils,
  movies: Film,
  education: GraduationCap,
  rent: Home,
  shopping: ShoppingCart,
  salary: Wallet,
  savings: PiggyBank,
  bank: Landmark,
  transport: Car,
  health: Hospital,
  bills: FileText,
  phone:PhoneCall,
  others: CircleDollarSign
};

export const ICON_KEYS = Object.keys(CATEGORY_ICONS);

export const getCategoryIcon = (iconName) => {
  return CATEGORY_ICONS[iconName] || HelpCircle;
};
