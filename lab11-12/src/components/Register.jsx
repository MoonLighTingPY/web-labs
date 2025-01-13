import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerError = useSelector((state) => state.user.registerError);
  const userExists = useSelector((state) => state.user.userExists);
  

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(registerUser(values));
      if (registerUser.fulfilled.match(result)) {
        await dispatch(loginUser({ email: values.email, password: values.password }));
        navigate('/');
      }
    },
  });

  return (
    <Box className="form-container">
      <Typography variant="h4" className="form-title">
        Register
      </Typography>
    <Box component="form" onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        variant="outlined"
        id="username"
        name="username"
        label="Username"
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        sx={{ mt: 2 }}
      />
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
      <TextField
        fullWidth
        variant="outlined"
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        sx={{ mt: 2 }}
      />
      {userExists && (
        <Typography color="error" sx={{ mt: 2 }}>
          An account with this email or username already exists.
        </Typography>
      )}
      {registerError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {registerError}
        </Typography>
      )}
      <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
        Register
      </Button>
    </Box>
    </Box>
  );
};

export default Register;