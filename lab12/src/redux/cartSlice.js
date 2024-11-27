import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [], // Ensure initial state is an array
  reducers: {
    addToCart: (state, action) => {
      if (!Array.isArray(state)) return [];
      const { id, color, quantity, stock } = action.payload;
      const existingItem = state.find(item => item.id === id && item.color === color);
      if (existingItem) {
        if (existingItem.quantity + quantity <= stock) {
          existingItem.quantity += quantity;
        } else {
          console.log('Stock limit exceeded');
        }
      } else {
        if (quantity <= stock) {
          state.push(action.payload);
        } else {
          console.log('Stock limit exceeded');
        }
      }
    },
    incrementQuantity: (state, action) => {
      if (!Array.isArray(state)) return []; // Ensure state is an array
      const item = state.find(i => i.id === action.payload.id && i.color === action.payload.color);
      if (item && item.quantity < action.payload.stock) {
        item.quantity += 1;
      } else {
        console.log('Stock limit exceeded');
      }
    },
    decrementQuantity: (state, action) => {
      if (!Array.isArray(state)) return []; // Ensure state is an array
      const item = state.find(i => i.id === action.payload.id && i.color === action.payload.color);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeFromCart: (state, action) => {
      if (!Array.isArray(state)) return []; // Ensure state is an array
      return state.filter(i => !(i.id === action.payload.id && i.color === action.payload.color));
    },
    clearCart: (state) => {
      if (!Array.isArray(state)) return []; // Ensure state is an array
      return [];
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;