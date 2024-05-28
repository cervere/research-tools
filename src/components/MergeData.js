// MainComponent.js
import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext.js';
import CsvUploader from './CsvUploader.js';
import Button from '@mui/material/Button';
import TableDisplay from './TableDisplay.js';
import GenericAccordians from './utils/GenericAccordians.js';
import WordSelector from './utils/WordSelector.js';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getDataByFeatures, getDataByFeaturesComplex, calculateStatisticsByCategory } from '../utils/Stats.js';
import { Typography } from '@mui/material';
import Papa from 'papaparse';
import FeatureSelect from './utils/FeatureSelect.js';
import { mySplice } from '../utils/ArrayUtils.js';
import DataTypeValidator from './utils/DataTypeValidator.js'



function MergeData() {
  const { preparedData, setPreparedData, 
    figuresReady, setFiguresReady, 
    statisticsReady, setStatisticsReady, 
    uploadedFile, setUploadedFile,
    setNewFile,
    columnsFound, 
    finalColumns, setFinalColumns,
    includedExcludedColumns, setIncludedExcludedColumns,
    finalColumnsStatus, setFinalColumnsStatus,
    dataToAnalyze, refreshContent,
    outcome, setOutcome,
    columnMetadata, setColumnMetadata,
    skipFirstNLines, setSkipFirstNLines,
    onValidateDataTypes
  } = useContext(DataContext);
  const [elements, setElements] = useState([]);
  const [fileToProcess, setFileToProcess] = useState(uploadedFile);
  const [data, setData] = useState([]);
  const [parsedResult, setParsedResult] = useState();
  // const [columnsFound, setColumnsFound] = useState([]);
  // const [outcome, setOutcome] = useState(preparedData?.outcome);
  const [outcomeTemp, setOutcomeTemp] = useState();
  const [outcomeObject, setOutcomeObject] = useState();
  // const [finalColumns, setFinalColumns] = useState([]);
  // const [finalColumnsStatus, setFinalColumnsStatus] = useState('');
  // const [includedExcludedColumns, setIncludedExcludedColumns] = useState();

  const [dataByFeatureRows, setDataByFeatureRows] = useState();
  const [dataTypesValidated, setDataTypesValidated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [onOutcomeSelect, setOnOutcomeSelect] = useState((event, newValue) => {
    setOutcomeTemp(newValue);
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onFileUpload = (file) => {
    setNewFile(true);
    setUploadedFile(file);
  }

  const getFeatureSelectElem = (includedExcludedColumns, finalColumnsStatus, onFinalize, setSkipFirstNLines) => {
    return {
      title: 'Select the columns of interest',
      description: finalColumnsStatus || '',
      element: <FeatureSelect includedExcludedColumns={includedExcludedColumns} 
      onFinalize={onFinalize}
      setSkipFirstNLines={setSkipFirstNLines} 
      />
    }
  }

  const getOutcomeSelectElem = (options, defaultValue) => {
    return  {
            title: 'Select the outcome of interest',
            description: defaultValue ? `Outcome: ${defaultValue}`: '',
            element:  <Autocomplete
            onChange={(event, newValue) => {
              setOutcomeTemp(newValue)
            }}
            value={defaultValue} 
            id="select-outcome"
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={"Outcome"} />}
          />
    }
  } 

  const onUpdateDataTypes = (wordsBySection) => {
    onValidateDataTypes(wordsBySection)
    setExpanded(false);
  }

  const getDataTypeValidatorElem = (columnMetadata, onUpdateDataTypes) => {
    return {
              title: `Validate Data Types`,
              description: columnMetadata.userValidated ? 'Datatypes Validated!' : 'Please validate!',
              element: <DataTypeValidator 
              columnMetadata={columnMetadata}
              onUpdateDataTypes={onUpdateDataTypes}
            />
    }
  }

  const getDataDisplayElem = (dataToAnalyze, finalColumns) => {
    return {
              title: 'Preview Data for Analysis',
              description: '',
              element: <TableDisplay 
              columns={finalColumns.map((col) => (
                {
                  accessorKey: col,
                  header: col,
                  size: 40,
                }))
              }
              data={dataToAnalyze}
              />
    }
  }
  /**
   * write a useEffect for creating all elements at once
   */
  useEffect(() => {
    const newElems = [];
    if(includedExcludedColumns) {
      newElems.push(getFeatureSelectElem(includedExcludedColumns, finalColumnsStatus, onFinalize, setSkipFirstNLines));
    } else if (columnsFound.length > 0) {
      const incExcColumns = [
        columnsFound.slice(0,20).map((word) => ({word})),
        columnsFound.slice(20).map((word) => ({word}))
      ]
      newElems.push(getFeatureSelectElem(incExcColumns, finalColumnsStatus, onFinalize, setSkipFirstNLines));
    }
    if(finalColumns.length > 0) {
      newElems.push(getOutcomeSelectElem(finalColumns, outcome))
    }
    if(columnMetadata) {
      newElems.push(getDataTypeValidatorElem(columnMetadata, onUpdateDataTypes))
    }
    if(finalColumns.length > 0 && dataToAnalyze.length > 0) {
      newElems.push(getDataDisplayElem(dataToAnalyze, finalColumns))
    }
    newElems.length > 0 && setElements(newElems);
  }, [columnsFound, includedExcludedColumns, finalColumns, columnMetadata])


  useEffect(() => {
    if(outcomeTemp) {
      setOutcomeObject({
        previous: outcome,
        current: outcomeTemp
      })
    }
  }, [outcomeTemp])

  useEffect(() => {
    if(outcomeObject) {
      setOutcome(outcomeObject.current);
    }
  }, [outcomeObject])

  const onFinalize = (wordsBySection) => {
    const includedWords = wordsBySection[0]; 
    setIncludedExcludedColumns(wordsBySection)
    setFinalColumns(includedWords.map(({word}) => word));
    setFinalColumnsStatus(`${includedWords.length} features chosen`);
    setExpanded(false);
  }

  return (
    <div>
      <CsvUploader onFileUpload={onFileUpload} />
      {/* <DataTable data={data} /> */}
      <Button sx={{margin: "20px 10px;"}} 
      disabled={!uploadedFile}
      onClick={() => {
        refreshContent(parsedResult)
      }} 
      variant="contained" color="secondary"> 
      Refresh Content 
      </Button>
      {/* <Button 
      disabled={dataToAnalyze.length === 0}
      variant="contained" 
      onClick={() => exportToDocx(statistics)}> 
      Export to DOCX 
      </Button> */}
      {
        elements.length > 0 &&
        <GenericAccordians 
        elements={elements}
        expanded={expanded}
        handleChange={handleChange}
        />
      }
      {
        
      }
    </div>
  );
}

export default MergeData;
