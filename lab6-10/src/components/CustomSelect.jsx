// src/components/CustomSelect.jsx
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CustomSelect = ({ value, onChange, label, items, sx }) => {
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
