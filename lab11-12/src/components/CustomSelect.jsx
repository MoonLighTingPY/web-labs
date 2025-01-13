// src/components/CustomSelect.jsx
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

const CustomSelect = ({ value, onChange, label, items, sx }) => {
  CustomSelect.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    sx: PropTypes.object,
  };
  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120, ...sx }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} label={label}>
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
