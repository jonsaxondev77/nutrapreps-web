export type DeliveryDay = 'Sunday' | 'Wednesday' | 'Both';

export interface Package {
    id: number;
    name: string;
    description?: string;
    price: number;
    mealsPerWeek: number;
    stripeProductId?: string;
}

export interface MealOption {
    id: number;
    name: string;
    isAddon: boolean;
    mealId: number;
    meal: Meal;
}

export interface Meal {
  id: number;
  name: string;
  description: string;
  fat: string;
  carbs: string;
  protein: string;
  calories: string;
  allergies: string;
  supplement: string;
}

export interface Extra {
  id: number;
  name: string;
  allergens: string;
  price: string;
  soldOut: boolean;
}

export interface OrderItem {
    id: number;
    name: string;
    price: number;
}
