// CsvUploader.js
import React, { useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function CsvUploader({ onFileUpload }) {
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onFileUpload(file);
  };

  return (
    <OutlinedInput
        id="outlined-adornment-password"
        type="file"
        accept=".csv" 
        onChange={handleFileUpload} 
        endAdornment={<InputAdornment position="end">
            <Tooltip title="Accepted formats: CSV">
              <IconButton
                aria-label="toggle password visibility"
                // onClick={handleAddAll}
                edge="end"
              >
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
        label="Filter columns to add at once"
      />
    // <input type="file" accept=".csv" onChange={handleFileUpload} />
  );
}

export default CsvUploader;
