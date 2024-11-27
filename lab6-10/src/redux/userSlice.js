// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart } from './cartSlice'; // Import the clearCart action

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

export const checkUserExists = createAsyncThunk(
    'user/checkUserExists',
    async ({ email, username }) => {
      const response = await axios.post('/api/checkUserExists', { email, username });
      return response.data.exists;
    }
  );

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
      saveCart: (state, action) => {
        state.cart = action.payload;
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
            username: action.payload.username
            };
            state.loginError = null;
            console.log('User state after login:', state.user); // Log user state
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.isAuthenticated = false;
          state.user = null;
          state.loginError = action.payload;
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
        .addCase(checkUserExists.fulfilled, (state, action) => {
          state.userExists = action.payload;
        })
        .addCase(clearCart, (state) => {
          state.cart = [];
        });
    },
  });
  
  export const { logoutUser, saveCart, updateUsername } = userSlice.actions;
  export default userSlice.reducer;