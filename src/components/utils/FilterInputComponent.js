import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export const FilterInputComponent = ({ filterInput, onFilterInput, handleAddAll, handleMouseDownPassword, role }) => {
return (
    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">Filter columns to {role}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type="text"
        // value={filterInput}
        onChange={onFilterInput}
        endAdornment={
          filterInput && <InputAdornment position="end">
            <Tooltip title={`${role} All`}>
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleAddAll}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
        label="Filter columns to add at once"
      />
    </FormControl>
  );
};

export default FilterInputComponent;