import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardMedia, Alert, TextField } from '@mui/material';
import { addToCart } from '../redux/cartSlice';
import CustomSelect from './CustomSelect.jsx';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => {
    console.log('Cart state:', state.cart);
    return Array.isArray(state.cart) ? state.cart : [];
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(response => {
        const bookData = response.data;
        setBook(bookData);

        const availableColors = Object.keys(bookData.stock).filter(color => bookData.stock[color] > 0);
        if (availableColors.length > 0) {
          setSelectedColor(availableColors[0]); // Set default color to the first available color
        } else {
          setFeedback('There is nothing in stock for this book.');
          setSelectedColor(availableColors[0]); // Set default color to the first available color
        }
      })
      .catch(error => console.error('Error fetching book details:', error));
  }, [id]);

  if (!book) return <Typography>Loading...</Typography>;

  const handleAddToCart = () => {
    const cartItem = cart.find(item => item.id === book.id && item.color === selectedColor);
    const totalBooksInCart = cart.reduce((total, item) => total + item.quantity, 0);
    const updatedQuantity = cartItem ? cartItem.quantity + quantity : quantity;
  
    if (updatedQuantity > book.stock[selectedColor]) {
      const availableColors = Object.keys(book.stock).filter(color => book.stock[color] > 0 && color !== selectedColor);
      setFeedback(`You cannot add more of this book in ${selectedColor} than is in stock. Available colors: ${availableColors.join(', ')}`);
    } else {
      console.log('Adding to cart:', { ...book, color: selectedColor, quantity, stock: book.stock[selectedColor] });
      dispatch(addToCart({ ...book, color: selectedColor, quantity, stock: book.stock[selectedColor] }));
      setFeedback(`Book added to cart successfully! You have ${updatedQuantity} of this book in ${selectedColor} in your cart. Total books in cart: ${totalBooksInCart + quantity}`);
    }
  };

  return (
    <Box mt={4} sx={{ maxWidth: 600, margin: 'auto' }}>
      <Card sx={{ borderRadius: '16px 16px 0 0', boxShadow: 'none' }}>
        <CardMedia
          component="img"
          height="300"
          image={book.picture}
          alt={book.title}
          sx={{ borderRadius: '16px 16px 0 0' }}
        />
        <CardContent>
          <Typography variant="h4">{book.title}</Typography>
          <Typography color="textSecondary">By: {book.author}</Typography>
          <Typography>Pages: {book.pages}</Typography>
          <Typography>Price: ${book.price}</Typography>
          <Typography>Description: {book.description}</Typography>
          <Typography>Category: {book.category}</Typography>
          <Typography>Stock: {book.stock[selectedColor]} ({selectedColor})</Typography>
        </CardContent>
      </Card>
      <Box mt={4}>
        <CustomSelect
          value={selectedColor}
          onChange={e => setSelectedColor(e.target.value)}
          label="Color"
          items={Object.keys(book.stock).map(color => ({ value: color, label: color }))}
          sx={{ minWidth: '120px' }} // Set the same minWidth
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          inputProps={{ min: 1, max: book.stock[selectedColor] }}
          sx={{ marginLeft: '16px', minWidth: '120px' }} // Set the same minWidth
        />
        <Button variant="contained" onClick={() => navigate(-1)} style={{ marginRight: '16px' }}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={book.stock[selectedColor] <= 0}
          sx={{
            backgroundColor: book.stock[selectedColor] <= 0 ? 'grey.500' : 'primary.main',
            '&:hover': {
              backgroundColor: book.stock[selectedColor] <= 0 ? 'grey.500' : 'primary.dark',
            },
          }}
        >
          Add to Cart
        </Button>
      </Box>
      {feedback && (
        <Box mt={2}>
          <Alert severity="info">{feedback}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default BookDetails;