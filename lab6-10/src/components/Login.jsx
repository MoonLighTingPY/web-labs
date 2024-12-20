import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useDispatch} from 'react-redux';
import { loginUser, updateUsername } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; // Import useState

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null); // Initialize loginError state

  const handleLogin = async (user) => {
    try {
      const result = await dispatch(loginUser(user)).unwrap();
      dispatch(updateUsername(result.username));
      navigate('/');
    } catch (error) {
      setLoginError(error.message || 'Invalid credentials');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    }),
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  return (
    <Box className="form-container">
      <Typography variant="h4" className="form-title">
        Login
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mt: 2 }}
        />
        {loginError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {loginError}
          </Typography>
        )}
        <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;