import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

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
        <FormControl variant="outlined" size="small">
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={e => setFilter(e.target.value)} label="Filter">
            <MenuItem value="">None</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="pages">Pages</MenuItem>
            <MenuItem value="author">Author</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small">
          <InputLabel>Order</InputLabel>
          <Select value={order} onChange={e => setOrder(e.target.value)} label="Order">
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography color="textSecondary">By: {book.author}</Typography>
                <Typography>Pages: {book.pages}</Typography>
                <Typography>Price: ${book.price}</Typography>
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