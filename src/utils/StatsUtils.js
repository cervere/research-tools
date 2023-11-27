// StatUtils.js
import * as ss from 'simple-statistics';

const _mean = (numbers) => numbers.reduce((accumulator, currentValue) => currentValue && typeof currentValue === 'number' ? accumulator + currentValue : accumulator, 0) / numbers.length;

function calculateStatistics(data, columnName) {
  const columnData = data.map((row) => row[columnName]);
  const columnDataNotNull = columnData.filter((num) => typeof num === 'number')
  const mean = ss.mean(columnDataNotNull);
  const median = ss.median(columnDataNotNull);
  const variance = ss.variance(columnDataNotNull);
  const stdDev = ss.standardDeviation(columnDataNotNull);

  return {
    mean,
    median,
    variance,
    stdDev,
  };
}

export default calculateStatistics;
