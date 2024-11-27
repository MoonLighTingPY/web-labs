// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearCart } from './cartSlice';
import axios from 'axios';


// Async thunk for logging in the user
export const loginUser = createAsyncThunk('user/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/login', credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for registering the user
export const registerUser = createAsyncThunk('user/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/register', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for saving the cart
export const saveCart = createAsyncThunk('user/saveCart', async (cartData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/saveCart', cartData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for checking the user's ID and existence
export const getUserId = createAsyncThunk('user/getUserId', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/getUserId', { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loginError = (state) => state.user.loginError;

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loginError: null,
    registerError: null,
    userExists: false,
    isAuthenticated: false,
    cart: [],
  },
  reducers: {
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.cart = [];
    },
    updateUsername: (state, action) => {
      if (state.user) {
        state.user.username = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = {
          email: action.payload.email,
          name: action.payload.name,
          username: action.payload.username,
        };
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loginError = action.payload;
      })
      .addCase(logoutUser, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.cart = [];
        clearCart(state);
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.registerError = null;
        state.userExists = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        if (action.payload.error === 'User already exists') {
          state.userExists = true;
        } else {
          state.registerError = action.payload.error;
        }
      })
      .addCase(getUserId.fulfilled, (state, action) => {
        state.userExists = action.payload;
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { logoutUser, updateUsername } = userSlice.actions;
export default userSlice.reducer;