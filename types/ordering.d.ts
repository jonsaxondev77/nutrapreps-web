// types/ordering.ts

// --- Core Data Models ---

export type DeliveryDay = 'Sunday' | 'Wednesday' | 'Both';

export interface Package {
    id: number;
    name: string;
    description?: string;
    price: number;
    mealsPerWeek: number;
    stripeProductId?: string;
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

export interface MealOption {
    id: number;
    name: string;
    isAddon: boolean;
    mealId: number;
    meal: Meal;
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


// --- Detailed Order & Cart Structure ---

export interface OrderedMeal {
    id: number;
    name: string;
    quantity: number;
}

export interface QuantifiedAddon {
    id: number;
    item: OrderItem;
    quantity: number;
}

export interface QuantifiedExtra {
    id: number;
    item: OrderItem;
    quantity: number;
}

export interface DetailedOrderItem {
    id: number;
    plan: Package;
    deliveryDay: DeliveryDay;
    meals: OrderedMeal[];
    addons: {
        sunday: QuantifiedAddon[];
        wednesday: QuantifiedAddon[];
    };
    desserts: QuantifiedExtra[];
}

export interface Order {
    id: number;
    totalPrice: number;
    orderItems: DetailedOrderItem[];
    extras: QuantifiedExtra[];
    name?: string;
    telephone?: string;
    hasPayment?: boolean;
}

// --- New Simplified Order for Confirmation ---
export interface SimpleOrder {
    id: number;
    totalPrice: number;
    customerName: string;
}

export interface OrderHistoryItem {
    id: number;
    orderDate: string;
    totalPrice: number;
    hasPayment: boolean;
}

export interface ShippingDetails {
    cost: number;
    stripeShippingRateId: string;
}
