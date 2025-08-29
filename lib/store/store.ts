import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi';
import { packageApi } from './services/packagesApi';
import orderReducer from './orderSlice';
import cartReducer, { CartState } from './cartSlice';
import { orderingApi } from './services/orderingApi';
import { addressApi } from './services/addressApi';

const saveToLocalStorage = (state: {cart: CartState}) => {
  try {
    const serializedState = JSON.stringify(state.cart);
    if(typeof window !== 'undefined') {
      localStorage.setItem('cartState', serializedState);
    }
  } catch(e) {
    console.warn("Could not save state", e);
  }
}

const loadFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) return undefined;
    return { cart: JSON.parse(serializedState) };
  } catch (e) {
    console.warn("Could not load state", e);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    order: orderReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [orderingApi.reducerPath]: orderingApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
  },
  preloadedState: loadFromLocalStorage(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, packageApi.middleware, orderingApi.middleware, addressApi.middleware),
});

store.subscribe(()=> saveToLocalStorage({cart: store.getState().cart}));

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store; // This is the AppStore type