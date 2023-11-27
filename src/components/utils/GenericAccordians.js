import React, { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const GenericAccordians = ({ elements, expanded, handleChange }) => {

      return (
        <div>
          {
            elements.map(({title, description, element}, i) => (<Accordion 
            key={i}
            sx={{margin: "10px 0;", backgroundColor:"lightpink"}} 
            expanded={expanded === `panel-${i}`} 
            onChange={handleChange(`panel-${i}`)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}> {description} </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {element}
            </AccordionDetails>
            </Accordion>
          ))
          } 
      </div>
      );
    };
    
  export default GenericAccordians;