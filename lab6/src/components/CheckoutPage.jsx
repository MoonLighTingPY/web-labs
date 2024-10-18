
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ErrorMessage from './ErrorMessage'; // Import the ErrorMessage component

const CheckoutPage = () => {
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'First name must be 15 characters or less')
        .required('First name is required'),
      lastName: Yup.string()
        .max(20, 'Last name must be 20 characters or less')
        .required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),
      address: Yup.string()
        .required('Address is required'),
    }),
    onSubmit: (values) => {
      // Handle successful form submission
      console.log('Form values:', values);
      // Redirect to success page
      history.push('/success');
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 4 }}>
      <Typography variant="h4">Checkout</Typography>

      <TextField
        fullWidth
        variant="outlined"
        id="firstName"
        name="firstName"
        label="First Name"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        sx={{ mt: 2 }}
      />
      {formik.touched.firstName && formik.errors.firstName && (
        <ErrorMessage message={formik.errors.firstName} />
      )}

      <TextField
        fullWidth
        variant="outlined"
        id="lastName"
        name="lastName"
        label="Last Name"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        sx={{ mt: 2 }}
      />
      {formik.touched.lastName && formik.errors.lastName && (
        <ErrorMessage message={formik.errors.lastName} />
      )}

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
        sx={{ mt: 2 }}
      />
      {formik.touched.email && formik.errors.email && (
        <ErrorMessage message={formik.errors.email} />
      )}

      <TextField
        fullWidth
        variant="outlined"
        id="phone"
        name="phone"
        label="Phone Number"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phone && Boolean(formik.errors.phone)}
        sx={{ mt: 2 }}
      />
      {formik.touched.phone && formik.errors.phone && (
        <ErrorMessage message={formik.errors.phone} />
      )}

      <TextField
        fullWidth
        variant="outlined"
        id="address"
        name="address"
        label="Address"
        value={formik.values.address}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.address && Boolean(formik.errors.address)}
        sx={{ mt: 2 }}
      />
      {formik.touched.address && formik.errors.address && (
        <ErrorMessage message={formik.errors.address} />
      )}

      <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
        Continue
      </Button>
    </Box>
  );
};

export default CheckoutPage;
