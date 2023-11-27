import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {  generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { data } from './makeData';

//defining columns outside of the component is fine, is stable
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 40,
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    size: 120,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    size: 120,
  },
  {
    accessorKey: 'company',
    header: 'Company',
    size: 300,
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'country',
    header: 'Country',
    size: 220,
  },
];

const csvOptions = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: true,
  // headers: columns.map((c) => c.header),
};

// const csvExporter = new ExportToCsv(csvOptions);

const TableDisplay = (props) => {
const {columns, data} = props
  const handleExportRows = (rows) => {
    const csv = generateCsv(csvOptions)(rows.map((row) => row.original));
    download(csvOptions)(csv)
  };

  const handleExportData = () => {
    const csv = generateCsv(csvOptions)(data);
    download(csvOptions)(csv)
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowSelection
      positionToolbarAlertBanner="bottom"
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
        >
          <Button
            color="primary"
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Data
          </Button>
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            //export all rows, including from the next page, (still respects filtering and sorting)
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Page Rows
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Selected Rows
          </Button>
        </Box>
      )}
    />
  );
};

export default TableDisplay;