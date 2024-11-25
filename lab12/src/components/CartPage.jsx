// src/components/CartPage.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart, setCart } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Grid, Alert, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import axios from 'axios';

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const email = useSelector((state) => state.user.user?.email);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        console.log ('Cart:', response.data);
        dispatch(setCart(response.data));
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setFeedback('Error fetching cart items');
      }
    };

    fetchCart();
  }, [dispatch]);

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleContinue = () => {
    navigate('/checkout');
  };

  const handleIncrement = (item) => {
    const cartItem = cart.find(cartItem => cartItem.id === item.id && cartItem.color === item.color);
    if (cartItem && cartItem.quantity < item.stock) {
      dispatch(incrementQuantity({ id: item.id, color: item.color, stock: item.stock, email }));
      setFeedback('');
    } else {
      setFeedback(`Cannot add more of ${item.title} in ${item.color} than is in stock.`);
    }
  };

  const handleDecrement = (item) => {
    dispatch(decrementQuantity({ id: item.id, color: item.color, email }));
    setFeedback('');
  };

  useEffect(() => {
    // This effect will run whenever the cart state changes
    cart.forEach(item => {
      if (item.quantity >= item.stock) {
        setFeedback(`Cannot add more of ${item.title} in ${item.color} than is in stock.`);
      }
    });
  }, [cart]);

  return (
    <Box className="cart-page" mt={4} sx={{ maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom className="welcome-text">
        Your Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {cart.map(item => (
              <Grid item xs={12} sm={6} md={4} key={`${item.id}-${item.color}`}>
                <Card sx={{ borderRadius: '16px 16px 0 0', boxShadow: 'none' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image_url} // Assuming 'picture' field exists in books.json
                    alt={item.title}
                    sx={{ borderRadius: '16px 16px 0 0' }}
                  />
                  <CardContent>
                    <Typography variant="h5">{item.title} ({item.color})</Typography>
                    <Typography variant="body2" color="textSecondary">By: {item.author}</Typography>
                    <Typography variant="body2">Price: ${item.price}</Typography>
                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <IconButton onClick={() => handleDecrement(item)}><Remove /></IconButton>
                      <Typography variant="body2" mx={2}>{item.quantity}</Typography>
                      <IconButton onClick={() => handleIncrement(item)} disabled={item.quantity >= item.stock}><Add /></IconButton>
                      <IconButton onClick={() => dispatch(removeFromCart({ id: item.id, color: item.color }))}><Delete /></IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} textAlign="center">
            <Typography variant="h6">Total Amount: ${totalAmount.toFixed(2)}</Typography>
            <Button variant="contained" component={Link} to="/" style={{ marginRight: '10px' }}>
              Back to Catalog
            </Button>
            <Button variant="contained" color="primary" onClick={handleContinue}>
              Continue to Checkout
            </Button>
          </Box>
          {feedback && (
            <Box mt={2}>
              <Alert severity="error">{feedback}</Alert>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CartPage;