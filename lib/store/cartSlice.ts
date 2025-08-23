import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderState } from './orderSlice';

export interface CartItem extends OrderState {
  id: string;
  totalPrice: number;
}

interface CartState {
  cartItems: CartItem[];
  lastCompletedOrder: CartItem[] | null;
}

const initialState: CartState = {
  cartItems: [],
  lastCompletedOrder: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ order: OrderState, totalPrice: number }>) {
      const { order, totalPrice } = action.payload;
      const newCartItem: CartItem = {
        ...order,
        id: new Date().toISOString(),
        totalPrice,
      };
      state.cartItems.push(newCartItem);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    clearCart(state) {
      state.cartItems = [];
    },
    completeOrder(state, action: PayloadAction<CartItem[]>) {
        state.lastCompletedOrder = action.payload;
        state.cartItems = [];
    },
    clearLastCompletedOrder(state) {
        state.lastCompletedOrder = null;
    }
  },
});

export const { addItem, removeItem, clearCart, completeOrder, clearLastCompletedOrder } = cartSlice.actions;

export default cartSlice.reducer;
