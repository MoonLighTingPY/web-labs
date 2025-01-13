import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../App.css';

function HomeContent() {
  const [books, setBooks] = useState([]);
  const [visibleBooks, setVisibleBooks] = useState(3);
  const token = localStorage.getItem('jwtToken');
  let email = 'Guest';

  if (token) {
    const decodedToken = jwtDecode(token);
    console.log('Decoded token:', decodedToken);
    email = decodedToken.email;
  }

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
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: 'var(--primary-color)', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '20px' 
        }}
      >
        Welcome, {email}!
      </Typography>
      {featuredBook && (
        <Box mb={4}>
          <Card sx={{ borderRadius: '16px 16px 0 0' }}>
            <CardContent className="flex-container">
              <div className="left-section">
                <CardMedia
                  component="img"
                  height="300"
                  image={featuredBook.image_url}
                  alt={featuredBook.title}
                  sx={{ borderRadius: '16px 16px 0 0' }}
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
        {otherBooks.map((book, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={book.image_url}
                alt={book.title}
              />
              <CardContent>
                <Typography variant="h5">{book.title}</Typography>
                <Typography color="textSecondary">By: {book.author}</Typography>
                <Typography>Pages: {book.pages}</Typography>
                <Typography>Price: ${book.price}</Typography>
                <Typography>{book.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box textAlign="center" mt={4}>
        <Button variant="contained" color="primary" onClick={handleViewMore}>
          View More
        </Button>
      </Box>
    </Box>
  );
}

export default HomeContent;