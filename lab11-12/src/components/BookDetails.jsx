
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardMedia, Alert, TextField } from '@mui/material';
import CustomSelect from './CustomSelect.jsx';
import { getAuthHeaders } from '../utils/api';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(response => {
        const bookData = response.data;
        const stockObject = bookData.stock.reduce((acc, item) => {
          acc[item.color] = item.quantity;
          return acc;
        }, {});
        setBook({ ...bookData, stock: stockObject });
        const availableColors = Object.keys(stockObject).filter(color => stockObject[color] > 0);
        if (availableColors.length > 0) {
          setSelectedColor(availableColors[0]); // Set default color to the first available color
        } else {
          setFeedback('There is nothing in stock for this book.');
        }
      })
      .catch(error => console.error('Error fetching book details:', error));
  }, [id]);

  if (!book) return <Typography>Loading...</Typography>;

  const handleAddToCart = async () => {
    try {
      // Fetch existing cart items
      const existingCartResponse = await axios.get('/api/cart', getAuthHeaders());
      const existingCartItems = existingCartResponse.data;
  
      // Merge new item with existing cart items
      const newItem = {
        book_id: book.id,
        color: selectedColor,
        quantity: quantity
      };
  
      const existingItemIndex = existingCartItems.findIndex(
        item => item.book_id === newItem.book_id && item.color === newItem.color
      );
  
      let totalQuantity = newItem.quantity;
      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        totalQuantity += existingCartItems[existingItemIndex].quantity;
      }
  
      // Check if there is enough stock
      if (totalQuantity > book.stock[selectedColor]) {
        setFeedback('Not enough stock available.');
        return;
      }
  
      if (existingItemIndex !== -1) {
        existingCartItems[existingItemIndex].quantity = totalQuantity;
      } else {
        existingCartItems.push(newItem);
      }
  
      // Save updated cart items
      const response = await axios.post(
        'http://localhost:5000/api/saveCart',
        {
          cartItems: existingCartItems.map(item => ({
            bookId: item.book_id,
            color: item.color,
            quantity: item.quantity
          }))
        },
        getAuthHeaders()
      );
  
      console.log('Add to cart response:', response.data);
      setFeedback('Book added to cart successfully!');
    } catch (error) {
      console.error('Error adding book to cart:', error);
      setFeedback('Failed to add book to cart.');
    }
  };

  return (
    <Box mt={4} sx={{ maxWidth: 600, margin: 'auto' }}>
      <Card sx={{ borderRadius: '16px 16px 0 0', boxShadow: 'none' }}>
        <CardMedia
          component="img"
          height="300"
          image={book.image_url}
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