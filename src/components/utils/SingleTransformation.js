import React, {useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { FormControl } from '@mui/material';
import Text from '@mui/material/Typography';


const SingleTransformation = ({options}) => {
    const [newColumn, setNewColumn] = useState();
    const [column, setColumn] = useState();
    const [operator, setOperator] = useState();
    const [threshold, setThreshold] = useState();
    const [category, setCategory] = useState();
    const [conditions, setConditions] = useState([]);
    const [lastCategory, setLastCategory] = useState();

    const resetState = () => {
        setColumn();
        setOperator();
        setThreshold();
        setCategory();
        setLastCategory();
        console.log('state reset')
    }

    const onCategoryAdd = () => {
        if(column && operator && threshold && category) {
            const currConds = conditions.slice();
            currConds.push({column, operator, threshold, category});
            setConditions(currConds);
            resetState();
        }
    }
    const onLastCategoryAdd = () => {
        if(lastCategory) {
            const currConds = conditions.slice();
            currConds.push({allElse: true, category: lastCategory});
            setConditions(currConds);
            resetState();
        }
    }

    const onDeleteCategory = (idx) => {
        const currConds = conditions.filter((condition, i) => i !== idx);
        setConditions(currConds);
    }

    console.log(column, operator, threshold, category)
  return (
    <FormControl>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
      }}
      noValidate
      autoComplete="off"
    >
        <TextField
          required
          id="outlined-feature"
          label="New Column"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {setNewColumn(e.target.value)}}
        />
        <Button disabled={!conditions || conditions.length === 0} variant="contained" color="primary" sx={{height: '50px'}}>
         Add Column
       </Button>
    </Box>        
    {
            conditions && conditions.map((condition, idx) => {
                const {column, operator, threshold, category} = condition;
                return (
                    <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { m: 1, width: '25ch' },
                      display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                        id="ro-column"
                        label="Column"
                        type="text"
                        value={column}
                        InputLabelProps={{
                          readOnly: true,
                        }}
                      />
                    <TextField
                        id="ro-operator"
                        label="Condition"
                        type="text"
                        value={operator}
                        InputLabelProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        id="ro-number"
                        label="Number"
                        type="number"
                        value={threshold}
                        InputLabelProps={{
                          readOnly: true,
                        }}
                      />
                     <TextField
                       id="ro-cat-label"
                       label="Category Name"
                       type="text"
                       value={category}
                       InputLabelProps={{
                        readOnly: true,
                    }}
                     /> 
                     <Button variant="contained" color="primary" sx={{height: '50px'}} onClick={() => {onDeleteCategory(idx)}}>
                      Delete Category
                    </Button>
                  </Box> 
                )
            })
        }
          {
            conditions && conditions.length > 0 && 
            <Box
       component="form"
       sx={{
         '& .MuiTextField-root': { m: 1, width: '25ch' },
         display: 'flex',
           flexDirection: 'row-reverse',
           alignItems: 'center',
       }}
       noValidate
       autoComplete="off"
     >
        <Button 
        disabled={!lastCategory}
        variant="contained" 
        color="primary" sx={{height: '50px'}}
        onClick={onLastCategoryAdd}
        >
         Add Category
       </Button>
       <TextField
          required
          id="outlined-cat-label"
          label="Last Category Name"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {setLastCategory(e.target.value)}}
        />
        <Button 
        variant="contained" 
        color="secondary" sx={{height: '50px'}}
        onClick={onCategoryAdd}
        >
         All Else
       </Button>
     </Box>
          }
       <Box
       component="form"
       sx={{
         '& .MuiTextField-root': { m: 1, width: '25ch' },
         display: 'flex',
           flexDirection: 'row',
           alignItems: 'center',
       }}
       noValidate
       autoComplete="off"
     >
       <Autocomplete
       key={`column-${conditions.length}`}
         options={options}
         renderInput={(params) => <TextField {...params} label="Column" />}
         onChange={(event, value) => {setColumn(value)}}
       />
       <Autocomplete
       key={`operator-${conditions.length}`}
         options={['>', '<', '=']}
         renderInput={(params) => (
           <TextField {...params} label="Condition" />
         )}
         sx={{width: 'auto'}}
         onChange={(event, value) => {setOperator(value)}}
     />
         <TextField
          key={`threshold-${conditions.length}`}
           required
           id="outlined-number"
           label="Number"
           type="number"
           InputLabelProps={{
             shrink: true,
           }}
           onChange={(e) => {setThreshold(e.target.value)}}
         />
        <TextField
          key={`category-${conditions.length}`}
          required
          id="outlined-cat-label"
          label="Category Name"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {setCategory(e.target.value)}}
        /> 
        <Button 
        disabled={!(column && operator && threshold && category)}
        variant="contained" 
        color="primary" sx={{height: '50px'}}
        onClick={onCategoryAdd}
        >
         Add Category
       </Button>
     </Box>

     </FormControl>
  );
};

export default SingleTransformation;