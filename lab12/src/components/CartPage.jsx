import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Grid, Alert, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState([]);
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
        console.log('Cart:', response.data);
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setFeedback('Error fetching cart items');
      }
    };

    fetchCart();
  }, []);

  const saveCart = async (updatedCart) => {
    try {
      const transformedCartItems = updatedCart.map(item => ({
        bookId: item.book_id,
        color: item.color,
        quantity: item.quantity
      }));
  
      await axios.post('/api/saveCart', { cartItems: transformedCartItems }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      setCart(updatedCart);
    } catch (error) {
      console.error('Error saving cart:', error);
      setFeedback('Error saving cart');
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleContinue = () => {
    navigate('/checkout');
  };

  const handleIncrement = async (item) => {
    try {
      // Fetch the book details to get the current stock
      const response = await axios.get(`http://localhost:5000/api/books/${item.book_id}`);
      const book = response.data;
      const stock = book.stock.find(stockItem => stockItem.color === item.color).quantity;
  
      // Check if the incremented quantity exceeds the available stock
      const updatedCart = cart.map(cartItem => 
        cartItem.id === item.id && cartItem.color === item.color
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
  
      const incrementedItem = updatedCart.find(cartItem => cartItem.id === item.id && cartItem.color === item.color);
      if (incrementedItem.quantity > stock) {
        setFeedback('Not enough stock available.');
        return;
      }
  
      // Save the updated cart
      await saveCart(updatedCart);
    } catch (error) {
      console.error('Error incrementing item quantity:', error);
      setFeedback('Error incrementing item quantity');
    }
  };

  const handleDecrement = async (item) => {
    const updatedCart = cart.map(cartItem => 
      cartItem.id === item.id && cartItem.color === item.color
        ? { ...cartItem, quantity: cartItem.quantity - 1 }
        : cartItem
    ).filter(cartItem => cartItem.quantity > 0);
    await saveCart(updatedCart);
  };

  const handleRemove = async (item) => {
    const updatedCart = cart.filter(cartItem => 
      !(cartItem.id === item.id && cartItem.color === item.color)
    );
    await saveCart(updatedCart);
  };

  return (
    <Box>
      <Typography variant="h4">Your Cart</Typography>
      {feedback && <Alert severity="error">{feedback}</Alert>}
      <Grid container spacing={2}>
        {cart.map(item => (
          <Grid item key={item.id + item.color} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.image_url}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="textSecondary">{item.author}</Typography>
                <Typography variant="body2" color="textSecondary">{item.color}</Typography>
                <Typography variant="body2" color="textSecondary">Quantity: {item.quantity}</Typography>
                <Typography variant="body2" color="textSecondary">Price: ${item.price}</Typography>
                <Box>
                  <IconButton onClick={() => handleIncrement(item)}>
                    <Add />
                  </IconButton>
                  <IconButton onClick={() => handleDecrement(item)}>
                    <Remove />
                  </IconButton>
                  <IconButton onClick={() => handleRemove(item)}>
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={2}>
        <Typography variant="h6">Total: ${totalAmount.toFixed(2)}</Typography>
        <Button variant="contained" color="primary" onClick={handleContinue}>Continue to Checkout</Button>
      </Box>
    </Box>
  );
};

export default CartPage;