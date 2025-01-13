// src/components/CheckoutPage.jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First Name is required'),
      lastName: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().required('Phone Number is required'),
      address: Yup.string().required('Address is required'),
    }),
    onSubmit: () => {
      dispatch(clearCart());
      navigate('/success');
    },
  });

  return (
    <Box className="container">
      <Typography className="form-title" variant="h4">
        Checkout
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        {['firstName', 'lastName', 'email', 'phone', 'address'].map((field, index) => (
          <TextField
            key={index}
            fullWidth
            variant="outlined"
            id={field}
            name={field}
            label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched[field] && Boolean(formik.errors[field])}
            helperText={formik.touched[field] && formik.errors[field]}
            sx={{ mt: 2 }}
          />
        ))}
        <Button type="submit" variant="contained" color="primary">
          Continue
        </Button>
      </Box>
    </Box>
  );
}

export default CheckoutPage;