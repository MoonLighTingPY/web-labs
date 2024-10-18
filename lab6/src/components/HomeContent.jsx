// HomeContent.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

function HomeContent() {
  const [books, setBooks] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState(3);

  useEffect(() => {
    // Fetch data from the backend REST API
    axios.get('http://localhost:5000/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const handleViewMore = () => {
    setVisibleBooks(prevVisibleBooks => prevVisibleBooks + 3);
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom align="center">
        Welcome to RomanBooks
      </Typography>
      <Grid container spacing={4}>
        {books.slice(0, visibleBooks).map((book, index) => (
          <Grid item xs={12} sm={6} md={4} key={book.id || index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography color="textSecondary">By: {book.author}</Typography>
                <Typography>Pages: {book.pages}</Typography>
                <Typography>Price: ${book.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {visibleBooks < books.length && (
        <Box mt={4} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleViewMore}>
            View More
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default HomeContent;
