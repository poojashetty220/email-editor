import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './emailSlice.js';

export const store = configureStore({
  reducer: {
    email: emailReducer
  }
});