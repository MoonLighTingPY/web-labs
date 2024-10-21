import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import '../App.css'

function HomeContent() {
  const [books, setBooks] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState(3);

  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const handleViewMore = () => {
    setVisibleBooks(prevVisibleBooks => prevVisibleBooks + 3);
  };

  const featuredBook = books[0];
  const otherBooks = books.slice(1, visibleBooks + 1);

  return (
    <Box mt={4}>
      {featuredBook && (
        <Box mb={4}>
          <Card>
            <CardContent className="flex-container">
              <div className="left-section">
                <CardMedia
                  component="img"
                  height="140"
                  image={featuredBook.picture}
                  alt={featuredBook.title}
                />
                <Typography variant="h4">{featuredBook.title}</Typography>
              </div>
              <div className="right-section">
                <Typography color="textSecondary">By: {featuredBook.author}</Typography>
                <Typography>Pages: {featuredBook.pages}</Typography>
                <Typography>Price: ${featuredBook.price}</Typography>
                <Typography>{featuredBook.description}</Typography>
              </div>
            </CardContent>
          </Card>
        </Box>
      )}

      <Grid container spacing={4}>
        {otherBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={book.picture}
                alt={book.title}
              />
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

      {visibleBooks < books.length - 1 && (
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