// MainComponent.js
import React, { useState, useEffect } from 'react';
import CsvUploader from './CsvUploader.js';
import Button from '@mui/material/Button';
import TableDisplay from './TableDisplay.js';
import GenericAccordians from './utils/GenericAccordians.js';
import WordSelector from './utils/WordSelector.js';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { getDataByFeatures, getDataByFeaturesComplex, calculateStatisticsByCategory } from '../utils/Stats.js';
import Box from '@mui/material/Box';

const mySplice = (yourArray, elementToRemove) => {
  const index = yourArray.indexOf(elementToRemove);    
  if (index !== -1) {
    return [...yourArray.slice(0, index), ...yourArray.slice(index+1)];
  } 
  return yourArray;
}


function DataViz({setStatisticsReady, setFiguresReady, setPreparedData}) {
  const [data, setData] = useState([]);
  const [parsedResult, setParsedResult] = useState();
  const [parsedSecResult, setParsedSecResult] = useState();
  const [parsedData, setParsedData] = useState([]);
  const [columnsFound, setColumnsFound] = useState([]);
  const [secColumns, setSecColumns] = useState([]);
  const [outcome, setOutcome] = useState();
  const [outcomeTemp, setOutcomeTemp] = useState();
  const [outcomeObject, setOutcomeObject] = useState();
  const [finalColumns, setFinalColumns] = useState([]);
  const [finalColumnsStatus, setFinalColumnsStatus] = useState('');
  const [includedExcludedColumns, setIncludedExcludedColumns] = useState();
  const [dataToAnalyze, setDataToAnalyze] = useState([]);
  const [dataByFeatureRows, setDataByFeatureRows] = useState();
  const [columnMetadata, setColumnMetadata] = useState();
  const [dataTypesValidated, setDataTypesValidated] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [statisticsHeader, setStatisticsHeader] = useState([]);
  const [disableStatistics, setDisableStatistics] = useState(true);
  const [showStatistics, setShowStatistics] = useState(false);
  const [elements, setElements] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [onOutcomeSelect, setOnOutcomeSelect] = useState((event, newValue) => {
    setOutcomeTemp(newValue);
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  
  const handleDataParsed = (parsedResult) => {
    console.log(parsedResult.meta?.fields)
    setParsedResult(parsedResult);
    refreshContent(parsedResult);
  };

  const handleSecondaryDataParsed = (parsedResult) => {
    console.log(parsedResult.meta?.fields)
    setParsedSecResult(parsedResult);
    const parsedColumns = parsedResult.meta?.fields;
    setSecColumns(parsedColumns);
  };

  const refreshContent = (parsedResult) => {
    const parsedColumns = parsedResult.meta?.fields;
    setColumnsFound(parsedColumns);
    const parsedData = parsedResult.data;
    setParsedData(parsedData);
    setOutcome();
    setIncludedExcludedColumns();
    setFinalColumns([]);
    setDataToAnalyze([]);
    // setElements([]);
    setShowStatistics(false);
    setDisableStatistics(true);
    setStatistics();
  }

  useEffect(() => {
    if(columnsFound.length > 0) {
      const newElems = [...elements];
      newElems[0] = {
        title: 'Select the columns of interest',
        description: '',
        // SO that custom styling can be added!!
        element:  <WordSelector 
        words={[
          {
            label: "Inclusion", 
            words: includedExcludedColumns ? includedExcludedColumns[0] : columnsFound.slice(0,20).map((word) => ({word}))
          },  
          {
            label: "Exclusion",
            words: includedExcludedColumns ? includedExcludedColumns[1] : columnsFound.slice(20).map((word) => ({word}))
          }
        ]}
        onFinalize={onFinalize}
        actionLabel="Confirm Selection"
      /> 
      }

      setElements(newElems);
    }
  }, [columnsFound]);


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
  
  useEffect(() => {
    if(outcome) {
      setExpanded(false);

      const newElems = [...elements];
      newElems[0] = {
        ...elements[0],
        description: `Outcome Selected : ${outcome}`
      }
      
      setElements(newElems);
    } else if (columnsFound.length > 0) {
      const newElems = [elements[0]];
      newElems[0] = {
        ...elements[0],
        description: ``
      }
      setElements(newElems);
    }
  }, [outcome])


  const onFinalize = (wordsBySection) => {
    const includedWords = wordsBySection[0]; 
    setIncludedExcludedColumns(wordsBySection)
    setFinalColumns(includedWords.map(({word}) => word));
    setFinalColumnsStatus(`${includedWords.length} features chosen`);
    setExpanded(false);
  }

  const onUpdateDataTypes = (wordsBySection) => {
    const numeric = wordsBySection[0].map(({word}) => word);
    const category = wordsBySection[1].map(({word}) => word);
    setColumnMetadata({
      numeric, 
      category,
      fields: [...numeric, ...category]
    });
    setDataTypesValidated(true);
    setExpanded(false);
    setPreparedData({columnMetadata, dataToAnalyze, outcome}); 
    setFiguresReady(true);
  }

  useEffect(() => {
    if(finalColumns.length > 0){
      console.log('fc', finalColumns)
      const newElems = [...elements];
      if(finalColumnsStatus) {
        newElems[0] = {
          ...elements[0],
          description: finalColumnsStatus
        }
        setElements(newElems);
      } else {
        newElems[0] = {
          ...elements[0],
          description: ''
        }
      }
      newElems[1] = {
        title: 'Select the outcome of interest',
        description: '',
        element:  <Autocomplete
        onChange={(event, newValue) => {
          setOutcomeTemp(newValue)
        }}
        id="select-outcome"
        options={finalColumns}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={"Outcome"} />}
      />
      }
      setElements(newElems);
      const subset = parsedData.map((row) => {
        const newRow = {}
        finalColumns.forEach((key) => {
            newRow[key] = row[key]
        });
        return newRow;
    })
    setDataToAnalyze(subset);
    setPreparedData({dataToAnalyze: subset, finalColumns: finalColumns}); 
    }
  }, [finalColumns, parsedData]);

  useEffect(() => {
    if(outcome) {
    // if(dataToAnalyze.length > 0 && finalColumns.length > 1) {
      const dataByFeatures = getDataByFeatures(dataToAnalyze, mySplice(finalColumns, outcome), outcome);
      const columnDataTypes = getColumnDTypes(dataByFeatures['Sample']);
      const columnMetadata = {}
      columnMetadata['fields'] = Array.from(Object.keys(columnDataTypes));
      columnMetadata['category'] = Object.keys(columnDataTypes).filter((feature) => columnDataTypes[feature] === 'CATEGORY');
      columnMetadata['category_doubt'] = Object.keys(columnDataTypes).filter((feature) => columnDataTypes[feature] === 'CATEGORY_DOUBT');
      columnMetadata['numeric'] = Object.keys(columnDataTypes).filter((feature) => columnDataTypes[feature] === 'NUMERIC');
      // setColumnMetadata(columnMetadata);
      setDataTypesValidated(false);
    
      const newElems = elements.slice(0,2);
      if(columnMetadata) {
        newElems[2] = {
          title: `Validate Data Types`,
          description: '',
          element: <WordSelector 
          words={[
            {label: "Numerical", words: columnMetadata.numeric.map((word) => ({word}))}, 
            {
              label: `Categorical`, 
              words: [
                ...columnMetadata.category.map((word) => ({word})),
                ...(columnMetadata.category_doubt.map((word) => ({word, style: {backgroundColor: '#FFF44F'}})))
              ]
            }
          ]}
          onFinalize={onUpdateDataTypes}
          actionLabel="Validate"
        />
        }
        newElems[3] = {
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
        setElements(newElems);
        }
    }
  }, [outcome])


  useEffect(() => {
    if(outcome && columnMetadata && dataTypesValidated && dataToAnalyze.length > 0) {
      const dataByFeaturesComplex = getDataByFeaturesComplex(dataToAnalyze, columnMetadata, outcome)
      setDataByFeatureRows(dataByFeaturesComplex);
      if(dataToAnalyze.length > 0 || dataByFeaturesComplex) {
        setDisableStatistics(false);
      }
      }
  }, [dataTypesValidated, dataToAnalyze, columnMetadata, outcome])

  const getColumnDTypes = (datasetByFeature) => {
    const featureDTypes = {}
    Object.keys(datasetByFeature).forEach((feature) => {
      featureDTypes[feature] = getDType(datasetByFeature[feature].slice(0, 10))
    })
    return featureDTypes;
  }

  const getDType = (sample) => {
    const unique = Array.from(new Set(sample));
    if(typeof unique[0] === 'string' && typeof unique[1] === 'string') {
      return 'CATEGORY'
    } else if (unique.length < sample.length/2) {
      // for 0's and 1's 
      return 'CATEGORY_DOUBT'
    } else {
      return 'NUMERIC'
    }
  }
  
  const getStatsTableHeader = (outcome, outcomeValues, measuresPerOutcome) => {
    const featureHeader = []
    featureHeader.push({
        id : 'feature',
        header: '',
        columns: [
          {
            accessorKey: 'feature',
            header: 'Characteristic',
            size: 40,
          }
        ]
      })
      const sampleHeader = []
      const outcomeHeader = []
      outcomeValues.forEach((outcome) => {
        const results = {
          id : outcome,
          header: outcome,
          columns: measuresPerOutcome.map((measure) => ({
              accessorKey: `${outcome}_${measure}`,
              header: measure,
              size: 40,
          }))
        }
        if(outcome !== 'pvalue') {
          if(outcome === 'Sample'){
            sampleHeader.push(results)
          } else {
            outcomeHeader.push(results)
          } 
        }
      })
      outcomeHeader.push({
        id : 'pvalue',
        header: 'Pvalue',
        columns: [{
            accessorKey: `${outcome}_pvalue`,
            header: 'Pvalue',
            size: 40,
        }]
      })
      return [
        {id: 'first-level-feature', header: '', columns: featureHeader},
        {id: 'first-level-sample', header: 'Sample', columns: sampleHeader},
        {id: 'first-level-outcome', header: outcome, columns: outcomeHeader}
      ]
  }


  const getNumericRow = (stats, numericField) => {
    const outcomeValues = Object.keys(stats).filter((key) => key !== 'pvalue');
    const row = {feature: numericField};
    outcomeValues.forEach((outcome) => {
      row[`${outcome}`] = {}
      row[`${outcome}`]['measure'] = `${stats[outcome][numericField].mean?.toFixed(2)}(±${stats[outcome][numericField].stdDeviation?.toFixed(2)})`;
      row[`${outcome}`]['N'] = `${stats[outcome][numericField].notNullCount}`;
    })
    row[`${outcome}_pvalue`] = stats['pvalue'][numericField].pValue.toFixed(3);
    return row
  }

  const getCategoryRow = (stats, categoryField) => {
    const outcomeValues = Object.keys(stats).filter((key) => key !== 'pvalue');;
    const row = {feature: categoryField};
    outcomeValues.forEach((outcome) => {
      row[outcome] = {}
      const measuresByCatValue = stats[outcome][categoryField]
      if(measuresByCatValue && measuresByCatValue.values) {
        row[outcome]['N'] = `${measuresByCatValue.notNullCount}`;
        Object.keys(measuresByCatValue.values).map((catValue) => {
          row[outcome][catValue] = {}
          row[outcome][catValue]['measure'] = `${measuresByCatValue.values[catValue].count}(${measuresByCatValue.values[catValue].pct}%)`;
        })
      }
    })
    console.log(outcome, categoryField, stats)
    row[`${outcome}_pvalue`] = stats['pvalue'][categoryField].pValue.toFixed(3);
    return row
  }

  const flattenNumericRowObj = (row) => {
    const flatRow = {}
    Object.keys(row).forEach((rowKey) => {
      if(typeof row[rowKey] === "object") {
        Object.keys(row[rowKey]).forEach((key) => {
          flatRow[`${rowKey}_${key}`] = row[rowKey][key];
        })
      } else {
        flatRow[rowKey] = row[rowKey]
      }
    })
    return [flatRow]
  }

  const flattenCategoryRowObj = (row) => {
    const flatRows = []
    const flatRow = {}
    Object.keys(row).forEach((rowKey) => {
      if(typeof row[rowKey] === "object") {
        flatRow[`${rowKey}_measure`] = '';
        flatRow[`${rowKey}_N`] = row[rowKey]['N'];
      } else {
        flatRow[rowKey] = row[rowKey]
      }
    })
    flatRows.push(flatRow);
    const uniqueValues = Object.keys(row['Sample']).filter((key) => typeof row['Sample'][key] === "object")
    uniqueValues.forEach((catValue) => {
      const flatRow = {}
      flatRow['feature'] = catValue
      Object.keys(row).map((outcomeVal) => {
        if(typeof row[outcomeVal] === "object") {
          flatRow[`${outcomeVal}_measure`] = row[outcomeVal][catValue] && row[outcomeVal][catValue]['measure'];
          flatRow[`${outcomeVal}_N`] = '';
        } else {
          // feature name
        }
      })
      flatRows.push(flatRow)
    })
    return flatRows
  }

  const handleCalculateStatistics = (e) => {
    e.preventDefault();
    const stats = calculateStatisticsByCategory(dataByFeatureRows, columnMetadata, outcome);
    const statsForDisplay = [];
    const outcomeValues = Object.keys(stats);
    const features = mySplice(finalColumns, outcome)
    const keyMeasuresPerOutcome = ['measure', 'N']
    const statsColumnHeader = getStatsTableHeader(outcome, outcomeValues, keyMeasuresPerOutcome);
    setStatisticsHeader(statsColumnHeader);
    columnMetadata.numeric.forEach((numericField, i) => {
      const numericRow = getNumericRow(stats, numericField);
      const flatRow = flattenNumericRowObj(numericRow);
      statsForDisplay.push(...flatRow);
    })
    columnMetadata.category.forEach((categoryField, i) => {
      const cagtegoryRow = getCategoryRow(stats, categoryField);
      const flatRows = flattenCategoryRowObj(cagtegoryRow)
      statsForDisplay.push(...flatRows);
    })
    setStatistics(statsForDisplay);
    setShowStatistics(true);
    setDisableStatistics(true);

    // setShowStatistics(true)
    // setStatistics([...statistics, { columnName, ...stats }]);
  };

  
  return (
    <div>
      <Box sx={{ '& button': { m: 1 } }}>
      <div>
        <Button variant="outlined" size="medium"> Upload main dataset </Button>
        <CsvUploader onDataParsed={handleDataParsed} />
        <Button sx={{margin: "20px 10px;"}} 
          disabled={disableStatistics}
          onClick={handleCalculateStatistics} 
          variant="contained" color="secondary"> 
          Calculate Statistics 
        </Button>
        <Button sx={{margin: "20px 10px;"}} 
        disabled={!parsedResult}
        onClick={() => {
          refreshContent(parsedResult)
        }} 
        variant="contained" color="secondary"> 
        Refresh Content 
        </Button>
      </div>
      <div>
        <Button variant="outlined" size="medium"> Upload secondary dataset </Button>
        <CsvUploader onDataParsed={handleSecondaryDataParsed} />
        {
          secColumns &&
          <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={secColumns}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="ID Field" />}
        />
        }
      </div>
      </Box>
      
      {/* <DataTable data={data} /> */}
      
      {/* <Button 
      disabled={dataToAnalyze.length === 0}
      variant="contained" 
      onClick={() => exportToDocx(statistics)}> 
      Export to DOCX 
      </Button> */}
      {showStatistics && 
      <TableDisplay 
        columns={statisticsHeader}
        // columns={Object.keys(statistics[0]).map((col) => (
        //   {
        //     accessorKey: col,
        //     header: col,
        //     size: 40,
        //   }))}
        data={statistics}
      />
      }
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

export default DataViz;
