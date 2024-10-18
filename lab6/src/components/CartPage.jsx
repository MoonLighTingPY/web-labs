// CartPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Grid } from '@mui/material';

const CartPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleContinue = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <Typography variant="h4">Cart</Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cart.map(item => (
              <Grid item xs={12} sm={6} key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span>{item.title}</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button onClick={() => dispatch(decrementQuantity(item.id))}>-</Button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <Button onClick={() => dispatch(incrementQuantity(item.id))}>+</Button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <Button variant="outlined" onClick={() => dispatch(removeFromCart(item.id))}>
                  Remove
                </Button>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6">Total Amount: ${totalAmount.toFixed(2)}</Typography>
          <Box mt={3}>
            <Button variant="contained" component={Link} to="/" style={{ marginRight: '10px' }}>
              Back to Catalog
            </Button>
            <Button variant="contained" color="primary" onClick={handleContinue}>
              Continue
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default CartPage;