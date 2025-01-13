import { addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } from './cartSlice';
import axios from 'axios';

const saveCart = async (cart, email, token) => {
  try {
    const response = await axios.post('/api/getUserId', { email });
    const userId = response.data.userId;

    const payload = {
      userId,
      cartItems: cart.map(item => ({
        bookId: item.id,
        quantity: item.quantity,
        color: item.color
      }))
    };
    console.log('Saving cart with payload:', payload);
    console.log('For user id and email:', userId, email);
    await axios.post('/api/saveCart', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

const cartMiddleware = store => next => action => {
  const result = next(action);

  if (
    [addToCart.type, incrementQuantity.type, decrementQuantity.type, removeFromCart.type, clearCart.type].includes(action.type)
  ) {
    const state = store.getState();
    const email = state.user.user?.email;
    const token = state.user.token; // Assuming the token is stored in the user slice
    if (email && token) {
      saveCart(state.cart, email, token);
    }
  }

  return result;
};

export default cartMiddleware;