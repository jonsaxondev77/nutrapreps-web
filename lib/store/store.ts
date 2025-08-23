import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi';
import { packageApi } from './services/packagesApi';
import orderReducer from './orderSlice';
import cartReducer from './cartSlice';
import { orderingApi } from './services/orderingApi';

export const store = configureStore({
  reducer: {
    order: orderReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [orderingApi.reducerPath]: orderingApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, packageApi.middleware, orderingApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store; // This is the AppStore type