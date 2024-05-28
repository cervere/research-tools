// MainComponent.js
import React, { useContext, useState} from 'react';
import { DataContext } from '../context/DataContext.js';
import Button from '@mui/material/Button';
import TableDisplay from './TableDisplay';
import { getDataByFeatures, getDataByFeaturesComplex, calculateStatisticsByCategory, getPairs } from '../utils/Stats';
import { mySplice } from '../utils/ArrayUtils.js';

function Table1() {
  const {preparedData, showStatistics} = useContext(DataContext);
  const [statistics, setStatistics] = useState([]);
  const [statisticsHeader, setStatisticsHeader] = useState([]);

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
      const valuePairs = getPairs(outcomeValues.filter((value) => value !== 'Sample' && value !== 'pvalue').sort());

      const effectSizes = {}
 

      outcomeHeader.push({
        id : 'effectsizes',
        header: 'Effect size',
        columns: valuePairs.map((pair) => {
          const key = `${pair[0]} vs ${pair[1]}`;
          return {
            accessorKey: `${key.replace(' ', '_')}`,
            header: key,
            size: 40,
          } 
        })
      })

      return [
        {id: 'first-level-feature', header: '', columns: featureHeader},
        {id: 'first-level-sample', header: 'Sample', columns: sampleHeader},
        {id: 'first-level-outcome', header: outcome, columns: outcomeHeader}
      ]
  }


  const getNumericRow = (stats, numericField, outcome) => {
    const outcomeValues = Object.keys(stats).filter((key) => key !== 'pvalue');
    const row = {feature: numericField};
    outcomeValues.forEach((outcome) => {
      row[`${outcome}`] = {}
      row[`${outcome}`]['measure'] = `${stats[outcome][numericField].mean?.toFixed(2)}(±${stats[outcome][numericField].stdDeviation?.toFixed(2)})`;
      row[`${outcome}`]['N'] = `${stats[outcome][numericField].notNullCount}`;
    })
    row[`${outcome}_pvalue`] = stats['pvalue'][numericField].pValue.toFixed(3);
    const effectSizes = stats['pvalue'][numericField].effectSizes;
    const valuePairs = getPairs(outcomeValues.filter((value) => value !== 'Sample' && value !== 'pvalue').sort());
    valuePairs.forEach((pair) => {
      const key = `${pair[0]} vs ${pair[1]}`;
      row[`${key.replace(' ', '_')}`] = effectSizes[key].toFixed(2); 
    })
    return row
  }

  const getCategoryRow = (stats, categoryField, outcome) => {
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
    const {dataToAnalyze, columnMetadata, finalColumns, outcome} = preparedData;
    const dataByFeaturesComplex = getDataByFeaturesComplex(dataToAnalyze, columnMetadata, outcome)
    const stats = calculateStatisticsByCategory(dataByFeaturesComplex, columnMetadata, outcome);
    const statsForDisplay = [];
    const outcomeValues = Object.keys(stats);
    const features = mySplice(finalColumns, outcome)
    const keyMeasuresPerOutcome = ['measure', 'N']
    const statsColumnHeader = getStatsTableHeader(outcome, outcomeValues, keyMeasuresPerOutcome);
    setStatisticsHeader(statsColumnHeader);
    columnMetadata.numeric.forEach((numericField, i) => {
      const numericRow = getNumericRow(stats, numericField, outcome);
      const flatRow = flattenNumericRowObj(numericRow);
      statsForDisplay.push(...flatRow);
    })
    columnMetadata.category.forEach((categoryField, i) => {
      const cagtegoryRow = getCategoryRow(stats, categoryField, outcome);
      const flatRows = flattenCategoryRowObj(cagtegoryRow)
      statsForDisplay.push(...flatRows);
    })
    setStatistics(statsForDisplay);
    // setShowStatistics(true)
    // setStatistics([...statistics, { columnName, ...stats }]);
  };

  
  return (
    <div>
      <Button sx={{margin: "20px 10px;"}} 
      disabled={!showStatistics}
      onClick={handleCalculateStatistics} 
      variant="contained" color="secondary"> 
      Calculate Statistics 
      </Button>
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
    </div>
  );
}

export default Table1;
