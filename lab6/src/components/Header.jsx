// Header.jsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link} from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
function Header() {


  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(to right, #24292e, #484e57)' }}>
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
          RomanBooks
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: '1rem', margin: '0 10px' }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/books" sx={{ fontSize: '1rem', margin: '0 10px' }}>
            Books
          </Button>
          <Button color="inherit" component={Link} to="/cart" sx={{ fontSize: '1rem', margin: '0 10px' }}>
            Cart
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
