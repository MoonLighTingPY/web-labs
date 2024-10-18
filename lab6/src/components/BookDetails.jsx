import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { addToCart } from '../redux/cartSlice';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(response => {
        setBook(response.data);
      })
      .catch(error => console.error('Error fetching book details:', error));
  }, [id]);

  if (!book) return <Typography>Loading...</Typography>;

  const handleAddToCart = () => {
    dispatch(addToCart(book));
  };

  return (
    <Box mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h4">{book.title}</Typography>
          <Typography color="textSecondary">By: {book.author}</Typography>
          <Typography>Pages: {book.pages}</Typography>
          <Typography>Price: ${book.price}</Typography>
          <Typography>Description: {book.description}</Typography>
          <Typography>Category: {book.category}</Typography>
        </CardContent>
      </Card>
      <Box mt={4}>
        <Button variant="contained" onClick={() => navigate(-1)} style={{ marginRight: '16px' }}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Box>
    </Box>
  );
};

export default BookDetails;