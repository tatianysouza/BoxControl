import { configureStore } from '@reduxjs/toolkit';
import vendasReducer from './slices/vendasSlice';

export const store = configureStore({
  reducer: {
    vendas: vendasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
