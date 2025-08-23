import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Plan, DeliveryDay, MealOption, OrderItem } from '@/types/ordering';

// Define the shape for items that have a quantity
interface QuantifiedOrderItem {
    item: OrderItem;
    quantity: number;
}

interface OrderState {
  plan: Plan | null;
  deliveryDays: DeliveryDay | null;
  meals: {
    sunday: (MealOption | null)[];
    wednesday: (MealOption | null)[];
  };
  addons: {
    sunday: QuantifiedOrderItem[];
    wednesday: QuantifiedOrderItem[];
  };
  desserts: QuantifiedOrderItem[];
}

const initialState: OrderState = {
  plan: null,
  deliveryDays: null,
  meals: {
    sunday: [],
    wednesday: [],
  },
  addons: {
    sunday: [],
    wednesday: [],
  },
  desserts: [],
};

// Helper function to calculate meal counts and initialize arrays
const initializeMeals = (state: OrderState) => {
    if (!state.plan || !state.deliveryDays) {
        state.meals.sunday = [];
        state.meals.wednesday = [];
        return;
    }

    const totalMeals = state.plan.mealsPerWeek;
    const isSplitDelivery = state.deliveryDays === 'Both';
    const mealsPerDay = isSplitDelivery ? totalMeals / 2 : totalMeals;

    const sundayMealsNeeded = state.deliveryDays === 'Sunday' || isSplitDelivery ? mealsPerDay : 0;
    const wednesdayMealsNeeded = state.deliveryDays === 'Wednesday' || isSplitDelivery ? mealsPerDay : 0;

    state.meals.sunday = Array(sundayMealsNeeded).fill(null);
    state.meals.wednesday = Array(wednesdayMealsNeeded).fill(null);
};


const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setPlan(state, action: PayloadAction<Plan>) {
      state.plan = action.payload;
      initializeMeals(state);
    },
    setDeliveryDays(state, action: PayloadAction<DeliveryDay>) {
      state.deliveryDays = action.payload;
      
      if (action.payload === 'Sunday') {
          state.addons.wednesday = [];
          state.desserts = [];
      } else if (action.payload === 'Wednesday') {
          state.addons.sunday = [];
      }
      
      initializeMeals(state);
    },
    selectMeal(state, action: PayloadAction<{ day: 'sunday' | 'wednesday', index: number, option: MealOption }>) {
      const { day, index, option } = action.payload;
      if (state.meals[day] && state.meals[day].length > index) {
        state.meals[day][index] = option;
      }
    },
    updateAddonQuantity(state, action: PayloadAction<{ item: OrderItem, quantity: number, day: 'sunday' | 'wednesday' }>) {
        const { item, quantity, day } = action.payload;
        const addonsForDay = state.addons[day];
        const existingAddonIndex = addonsForDay.findIndex(addon => addon.item.id === item.id);

        if (existingAddonIndex > -1) {
            if (quantity > 0) {
                addonsForDay[existingAddonIndex].quantity = quantity;
            } else {
                addonsForDay.splice(existingAddonIndex, 1);
            }
        } else if (quantity > 0) {
            addonsForDay.push({ item, quantity });
        }
    },
    updateDessertQuantity(state, action: PayloadAction<{ item: OrderItem, quantity: number }>) {
        const { item, quantity } = action.payload;
        const existingDessertIndex = state.desserts.findIndex(dessert => dessert.item.id === item.id);

        if (existingDessertIndex > -1) {
            if (quantity > 0) {
                state.desserts[existingDessertIndex].quantity = quantity;
            } else {
                state.desserts.splice(existingDessertIndex, 1);
            }
        } else if (quantity > 0) {
            state.desserts.push({ item, quantity });
        }
    },
    resetOrder(state) {
      return initialState;
    },
  },
});

export const {
  setPlan,
  setDeliveryDays,
  selectMeal,
  updateAddonQuantity,
  updateDessertQuantity,
  resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
