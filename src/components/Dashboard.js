import React, {useState, useEffect} from 'react';
import CollapseButton from './CollapseButton';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { ReactComponent as Logo } from './logo-cropped.svg';
import FormComponent from './FormComponent';
import Article from './article/Article';
import DocxReader from './DocxReader';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


const CreateDocumentAccordian = (props) => {
  const [title, setTitle] = useState('');
  const {expanded, handleChange, handleCreate} = props

  const onCreate = (e) => {
    e.preventDefault();
    title && handleCreate(title);
    setTitle('');
  }

  return         (<Accordion sx={{margin: "10px 0;", backgroundColor:"lightblue"}} expanded={expanded === 'create'} onChange={handleChange}>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="panel1bh-content"
    id="panel1bh-header"
  >
    <Typography sx={{ width: '33%', flexShrink: 0 }}>
      New Manuscript
    </Typography>
    <Typography sx={{ color: 'text.secondary' }}>Reset to see the example JSON format</Typography>
  </AccordionSummary>
  <AccordionDetails>
    {/* <Button sx={{margin: "20px 10px;"}} onClick={() => {}} variant="contained" color="secondary"> Reset </Button> */}
    <TextField
          fullWidth
          id="new-title-input"
          label="Title"
          placeholder="Enter your title..."
          value={title}
          onChange={(e) => {setTitle(e.target.value)}}
          helperText="Please delete it later if you decide to discard it!"
        />
    <Button variant="contained" onClick={onCreate}> Create </Button>
    <p> {title} </p>
  </AccordionDetails>
</Accordion>)
}

const Dashboard = ({ children }) => {
  const [articles, setArticles] = useState([{title: 'Title of the first article ever!!'},
  {title: 'Title of the second article ever!!'}]);
  const [writing, setWriting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

    return (
      <div>
          <CreateDocumentAccordian 
            expanded={expanded}
            handleChange={handleChange('create')}/>
  {
    articles.map((article, i) => (
     <Accordion 
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
         {article.title}
       </Typography>
       <Typography sx={{ color: 'text.secondary' }}> Word count : {article.wordcount || 'N/A' }</Typography>
     </AccordionSummary>
     <AccordionDetails>
       <Article 
        metadata={article}
       />
     </AccordionDetails>
     </Accordion>
    ))
  } 
    </div>
    );
  };
  
export default Dashboard;