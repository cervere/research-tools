import React, { useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const CheckboxPanel = ({ options, onCheckboxChange }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (option) => {
    const isChecked = checkedItems.includes(option);
    let updatedCheckedItems;

    if (isChecked) {
      updatedCheckedItems = checkedItems.filter((item) => item !== option);
    } else {
      updatedCheckedItems = [...checkedItems, option];
    }

    setCheckedItems(updatedCheckedItems);
    onCheckboxChange(updatedCheckedItems);
  };

  return (
    <FormGroup sx={{display: 'flex', flexDirection: 'row'}}>
    {options.map((option) => (
        <FormControlLabel 
        key={option}
        control={<Checkbox 
            checked={checkedItems.includes(option)} 
            onChange={() => handleCheckboxChange(option)}
            />
        } 
        label={option} 
        />
      ))}
  </FormGroup>
  );
};

export default CheckboxPanel;