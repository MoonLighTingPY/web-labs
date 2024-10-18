
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <Box textAlign="center" mt={5}>
      <Typography variant="h4">Checkout Successful!</Typography>
      <Typography variant="body1" mt={2}>
        Thank you for your purchase! Your order has been confirmed.
      </Typography>
      <Button variant="contained" component={Link} to="/" sx={{ mt: 4 }}>
        Back to Catalog
      </Button>
    </Box>
  );
};

export default SuccessPage;
