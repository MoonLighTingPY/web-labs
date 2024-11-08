import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const saveCart = async (cart) => {
  try {
    const userId = 1; // Replace with actual user ID
    const payload = {
      userId,
      cartItems: cart.map(item => ({
        bookId: item.id,
        quantity: item.quantity
      }))
    };
    console.log('Saving cart with payload:', payload);
    await axios.post('/api/saveCart', payload);
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: [], // Ensure initial state is an array
  reducers: {
    addToCart: (state, action) => {
      if (!Array.isArray(state)) return []; // Ensure state is an array
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
      saveCart(state);
    },
    incrementQuantity: (state, action) => {
      if (!Array.isArray(state)) return []; // Ensure state is an array
      const item = state.find(i => i.id === action.payload.id && i.color === action.payload.color);
      if (item && item.quantity < action.payload.stock) {
        item.quantity += 1;
      } else {
        console.log('Stock limit exceeded');
      }
      saveCart(state);
    },
    decrementQuantity: (state, action) => {
      if (!Array.isArray(state)) return []; // Ensure state is an array
      const item = state.find(i => i.id === action.payload.id && i.color === action.payload.color);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      saveCart(state);
    },
    removeFromCart: (state, action) => {
      if (!Array.isArray(state)) return []; // Ensure state is an array
      const newState = state.filter(i => !(i.id === action.payload.id && i.color === action.payload.color));
      saveCart(newState);
      return newState;
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;