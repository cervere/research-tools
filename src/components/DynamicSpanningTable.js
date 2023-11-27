import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import calculateStatistics from '../utils/StatsUtils';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const TAX_RATE = 0.07;

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function DynamicSpanningTable({columns, data}) {
    const theme = useTheme();
    const [fieldName, setFieldName] = React.useState([]);
    const [outcome, setOutcome] = React.useState([]);
    const [uniqueOutcomes, setUniqueOutcomes] = React.useState([]);

    const [datasetsForStats, setDatasetsForStats] = React.useState([data])

    React.useEffect(() => {
        const currFields = typeof fieldName === 'string' 
                        ? fieldName.split(',')
                        : fieldName
        setFieldName(currFields.filter((name) => outcome ? name !== outcome : true));
    }, [outcome])

    const handleOutcomeChange = (event) => {
        const {
          target: { value },
        } = event;
        setOutcome(value);
        const outcomeValues = data.map((row) => row[value])
        const uniqueOutcomes =  [...new Set(outcomeValues)];
        setUniqueOutcomes(uniqueOutcomes);
        const dataSubsets = uniqueOutcomes.map((outcomeValue) => {
            const subset = data.filter((row) => row[value] === outcomeValue)
            return subset;
        });
        setDatasetsForStats([...datasetsForStats, ...dataSubsets]);

    };

    const handleFieldChange = (event) => {
      const {
        target: { value },
      } = event;
      setFieldName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };
  
    const getOutcomeHeader = (outcome) => {
        console.log(uniqueOutcomes)
        return (
        [<TableRow>
            <TableCell align="center" colSpan={2} />
            <TableCell align="center" colSpan={2} > {outcome} </TableCell>
        </TableRow>, <TableRow>
            <TableCell align="center" colSpan={2} />
            {
            uniqueOutcomes.map((uo) => <TableCell align="center" colSpan={1} > {uo} </TableCell>)
            }
        </TableRow>]
            )
    }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
        <TableRow>
            <TableCell align="center" colSpan={2}>
              Fields of interest
            </TableCell>
            <TableCell align="center" colSpan={2}>Outcome</TableCell>
        </TableRow>
        <TableRow>
            <TableCell align="center" colSpan={2}>
            <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-field-label">Field</InputLabel>
        <Select
          labelId="demo-multiple-field-label"
          id="demo-multiple-field"
          multiple
          value={fieldName}
          onChange={handleFieldChange}
          input={<OutlinedInput id="select-multiple-chip" label="Field" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.filter((name) => outcome ? name !== outcome : true).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {columns.filter((name) => outcome ? name !== outcome : true).map((name) => (
            (<MenuItem
              key={name}
              value={name}
              style={getStyles(name, fieldName, theme)}
            >
              {name}
            </MenuItem>)
          ))}
        </Select>
      </FormControl>
            </TableCell>
            <TableCell  align="center" colSpan={2}>
            <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-field-label">Field</InputLabel>
        <Select
            labelId="demo-outcome-label"
            id="demo-outcome"
            value={outcome}
            label="Outcome"
            onChange={handleOutcomeChange}
         >
          {columns.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, fieldName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
            </TableCell>
        </TableRow>
        {
            outcome && getOutcomeHeader(outcome)
        }
          <TableRow>
            <TableCell align="center" colSpan={1}>
              Characteristic
            </TableCell>
            <TableCell align="center" colSpan={datasetsForStats.length === 1 ? 2 : 1} > Mean (±SD)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
              fieldName.map((field, i) => {
                  const results = datasetsForStats.map((dataset) => {
                    const stats = calculateStatistics(dataset, field);
                    return {field, value: `${stats.mean.toFixed(2)}(±${stats.stdDev.toFixed(2)})`}
                  })
                  const cspan = results.length === 2 ? 2 : 1
                  const stats = calculateStatistics(data, field);
                  return (
                    <TableRow key={`${field}-${i}`}>
                    <TableCell  align="center" colSpan={cspan}>{field}</TableCell>
                    {
                        results.map((res) => <TableCell  align="center" colSpan={cspan}>{res.value}</TableCell>)
                    }
                  </TableRow>
                  )
              })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
