

import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message }) => {
  return (
    <Typography variant="body2" color="error">
      {message}
    </Typography>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
