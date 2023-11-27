import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WordSelector from './WordSelector';
import Button from '@mui/material/Button';

const WordSelectorPanel = ({ expanded, handleChange, words }) => {
    
    return 
    (<Accordion 
    sx={{margin: "10px 0;", backgroundColor:"lightpink"}} 
    expanded={expanded} 
    onChange={handleChange()}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
    >
      <Typography sx={{ width: '33%', flexShrink: 0 }}>
        {'Here'}
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}> Word count : {'N/A' }</Typography>
    </AccordionSummary>
    <AccordionDetails>
    <WordSelector 
        words={words}
        />    
    </AccordionDetails>
    </Accordion>
    )
};

export default WordSelectorPanel;
