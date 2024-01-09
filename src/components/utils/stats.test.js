const { calculateCorrelationAndPValue } = require('./Stats.js');
// Test case for calculateCorrelationAndPValue function
const testCalculateCorrelationAndPValue = () => {
    const colA = [1, 2, 3, 4, 5];
    const colB = [2, 3, 4, 5, 6];
    const result = calculateCorrelationAndPValue(colA, colB);
    console.log(result);
  }
testCalculateCorrelationAndPValue();