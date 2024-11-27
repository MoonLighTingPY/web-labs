// src/components/Header.jsx
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/userSlice';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <AppBar position="static" sx={{ background: 'var(--primary-color)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
          RomanBooks
        </Typography>
        <Box>
          {['Home', 'Books', 'Cart'].map((text) => (
            <Button
              key={text}
              color="inherit"
              component={Link}
              to={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
              sx={{ margin: '0 10px' }}
            >
              {text}
            </Button>
          ))}
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout} sx={{ margin: '0 10px' }}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/register" sx={{ margin: '0 10px' }}>
                Register
              </Button>
              <Button color="inherit" component={Link} to="/login" sx={{ margin: '0 10px' }}>
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
