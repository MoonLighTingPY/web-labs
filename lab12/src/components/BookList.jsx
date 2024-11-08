import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button, Box, TextField, CardMedia, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomSelect from './CustomSelect.jsx';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books', {
          params: { search: searchTerm, filter, order }
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [searchTerm, filter, order]);

  const filterItems = [
    { value: '', label: 'None' },
    { value: 'title', label: 'Title' },
    { value: 'price', label: 'Price' },
    { value: 'pages', label: 'Pages' },
    { value: 'author', label: 'Author' }
  ];

  const orderItems = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ];

  return (
    <div className="book-list">
      <Typography variant="h2" gutterBottom>
        Book Catalog
      </Typography>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ marginRight: '16px' }}
        />
        <Box display="flex" justifyContent="space-between" mb={4}>
          <CustomSelect
            value={filter}
            onChange={e => setFilter(e.target.value)}
            label="Filter"
            items={filterItems}
            sx={{ minWidth: 150, marginRight: '16px' }}
          />
          <CustomSelect
            value={order}
            onChange={e => setOrder(e.target.value)}
            label="Order"
            items={orderItems}
          />
        </Box>
      </Box>
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card sx={{ borderRadius: '16px 16px 0 0', boxShadow: 'none', position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={book.picture}
                alt={book.title}
                sx={{ borderRadius: '16px 16px 0 0' }}
              />
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography color="textSecondary">By: {book.author}</Typography>
                <Typography>Pages: {book.pages}</Typography>
                <Typography>Price: ${book.price}</Typography>
                {Object.values(book.stock).every(stock => stock <= 0) && (
                  <Chip
                    label="Out of Stock"
                    color="error"
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                  />
                )}
                <Button component={Link} to={`/books/${book.id}`} variant="outlined" sx={{ mt: 2 }}>
                  View More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BookList;