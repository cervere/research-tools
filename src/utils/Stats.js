import jStat from 'jstat';
import {chiSquaredGoodnessOfFit} from 'simple-statistics';
import anova1 from '@stdlib/stats-anova1';
import chi2test from '@stdlib/stats-chi2test';

const mean = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;

// Function to calculate standard deviation
const standardDeviation = arr => {
  const avg = mean(arr);
  const squaredDiffs = arr.map(val => Math.pow(val - avg, 2));
  const variance = mean(squaredDiffs);
  return Math.sqrt(variance);
};

// Standardize the data (z-score normalization)
const standardize = arr => {
  const avg = mean(arr);
  const sd = standardDeviation(arr);
  return arr.map(val => (val - avg) / sd);
};

export const getPairs = (list) => {
    const pairs = []
    for(let i=0; i<list.length-1; i++) {
        for(let j=i+1; j<list.length; j++){
            pairs.push([list[i], list[j]])
        }
    }
    return pairs
}

export const calculateCorrelationAndPValue = (colA, colB) => {    
    // Standardize both columns
    // Assuming colB is groups
    const groups = {}
    colB.forEach((outcomeValue, i) => {
        if(outcomeValue in groups) {

        } else {
            groups[outcomeValue] = []
        }
        groups[outcomeValue].push(colA[i]);
    })
    const standardizedColA = standardize(colA);
    const standardizedColB = standardize(colB);
    // Calculate Pearson correlation coefficient
    const correlationCoefficient = jStat.anovafscore(Object.values(groups));

    // // Calculate p-value for the correlation coefficient
    const n = standardizedColA.length;
    const pValue = jStat.anovaftest(...Object.values(groups));
    const valuePairs = getPairs(Object.keys(groups).sort());

    console.log('>>> ', groups)
    const effectSizes = {}

    for(const pair of valuePairs) {
        const key = `${pair[0]} vs ${pair[1]}`;
        const refStd = jStat.stdev(groups[pair[0]]);
        if(refStd !== 0) {
            const effectSize = (jStat.mean(groups[pair[0]]) - jStat.mean(groups[pair[1]]))/refStd
            effectSizes[key] = effectSize
        }
    }


    // const pValue = jStat.ttest(correlationCoefficient, n - 2, 2);

    // // Fisher transformation to Z-score
    // const transformed = 0.5 * Math.log((1 + correlationCoefficient) / (1 - correlationCoefficient));
    // const standardError = 1 / Math.sqrt(n - 3); // For Pearson correlation

    // // Calculate Z-score
    // const zScore = transformed / standardError;
    // console.log( zScore , transformed,  standardError)


    // // Calculate the p-value from the Z-score
    // const pValue = 2 * jStat.normal.cdf(-Math.abs(zScore)); // For two-tailed test
    return {correlationCoefficient, pValue, effectSizes}
}

const calculateCorrelationNumericField = (values) => {
    // Assuming outcome is categorical
    const anovaResult = {F: jStat.anovafscore(values), p: jStat.anovaftest(...values)};
    console.log('One-Way ANOVA Result:');
    console.log('F-Statistic:', anovaResult.F);
    console.log('P-Value:', anovaResult.p);
    return {coef: anovaResult.F, pValue: anovaResult.p}
}

// Assuming colA and colB as two columns with categorical values, create a contingency table matrix
const createContingencyTable = (colA, colB, possibleColBValues) => {
    const contingencyTable = {};
    for (let i = 0; i < colA.length; i++) {
        if (!contingencyTable[colA[i]]) {
            contingencyTable[colA[i]] = {};
            possibleColBValues.forEach((value) => {
                contingencyTable[colA[i]][value] = 0;
            })
        }
        if (!contingencyTable[colA[i]][colB[i]]) {
            contingencyTable[colA[i]][colB[i]] = 1;
        } else {
            contingencyTable[colA[i]][colB[i]]++;
        }
    }
    return contingencyTable;
}

const calculateCorrelationCategoryField = (colA, colB, possibleColBValues) => {
    // Assuming outcome is categorical
    // Perform Chi-Square test
    const contingencyTable = createContingencyTable(colA, colB, possibleColBValues);
    // returns as {a: {x: 1, y: 1}, b: {x:1, y: 1}}
    console.log(contingencyTable)
    const contingencyTableArr = Object.keys(contingencyTable)
                                .map((k) => Object.values(contingencyTable[k])) 
    
    const chiSquareResult = chi2test(contingencyTableArr).toJSON();
    console.log(chiSquareResult)

    return {coef: chiSquareResult.statistic, pValue: chiSquareResult.pValue}
}

export const getCorrelationCoeffs = (dataByFeatureRows, columnMetadata, outcome) => {
    const correlationMetrics = {}
    const totalSample = dataByFeatureRows['Sample']
    columnMetadata.numeric.forEach((feature) => {
        const dataByOutcomeValues = {};
        const standardizedValues = standardize(totalSample[feature].values);
        standardizedValues.forEach((value, i) => {
            const outcomeValue = totalSample[feature][outcome][i]
            const featureValues = dataByOutcomeValues[outcomeValue] || [];
            featureValues.push(value);
            dataByOutcomeValues[outcomeValue] = featureValues
        })
        console.log('>>', feature, Object.values(dataByOutcomeValues));
        const corrCoefs = calculateCorrelationNumericField(Object.values(dataByOutcomeValues))
        // const  corrCoefs = calculateCorrelationAndPValue(totalSample[feature]['values'], totalSample[feature][outcome])
        correlationMetrics[feature] = corrCoefs;
    })
    columnMetadata.category.forEach((feature) => {
        const dataByOutcomeValues = {};
        const standardizedValues = totalSample[feature].values //standardize(totalSample[feature]['values_encoded']);
        standardizedValues.forEach((value, i) => {
            const outcomeValue = totalSample[feature][outcome][i]
            const featureValues = dataByOutcomeValues[outcomeValue] || [];
            featureValues.push(value);
            dataByOutcomeValues[outcomeValue] = featureValues
        })
        const  corrCoefs = calculateCorrelationCategoryField(Object.values(dataByOutcomeValues))
        correlationMetrics[feature] = corrCoefs;
    })
    return correlationMetrics;
}

const handleNull = (val) => {
    return (val !== '' || val !== 'null') ? val : undefined 
}

export const getDataByFeatures = (data, features, outcome) => {
    const groupedDataByOutcome = {}
    groupedDataByOutcome['Sample'] = {}
    features.forEach((feature) => {
        groupedDataByOutcome['Sample'][feature] = []
    })
    data.forEach((row) => {
        const outcomeValue = handleNull(row[outcome]);
        if(outcomeValue || outcomeValue === 0){
            if(!groupedDataByOutcome[outcomeValue]) {
                groupedDataByOutcome[outcomeValue] = {}
                features.forEach((feature) => {
                    groupedDataByOutcome[outcomeValue][feature] = []
                })
            }
            features.forEach((feature) => {
                const featureValue = handleNull(row[feature]);
                if(featureValue || featureValue === 0) {
                    groupedDataByOutcome[outcomeValue][feature].push(featureValue);
                    groupedDataByOutcome['Sample'][feature].push(featureValue);
                }
            })
        }
    })
    return groupedDataByOutcome
}

export const getDataByFeaturesComplex = (data, columnMetadata, outcome) => {
    const groupedDataByOutcome = {}
    groupedDataByOutcome['Sample'] = {}
    columnMetadata.fields.forEach((feature) => {
        groupedDataByOutcome['Sample'][feature] = {}
        groupedDataByOutcome['Sample'][feature]['values'] = []
        groupedDataByOutcome['Sample'][feature]['values_encoded'] = []
        groupedDataByOutcome['Sample'][feature][outcome] = []
    })
    const outcomeValues = new Map();
    const categoricalUniqueValues = {}
    columnMetadata.category.forEach((catFeature) => {
        categoricalUniqueValues[catFeature] = new Map();
    })
    data.forEach((row) => {
        const outcomeValue = handleNull(row[outcome]);
        if(outcomeValue || outcomeValue === 0){
            if(!outcomeValues.get(outcomeValue)) outcomeValues.set(outcomeValue, 1);
            // const outcomeValueIdx = Array.from(outcomeValues.keys()).findIndex((val) => val === outcomeValue);
            if(!groupedDataByOutcome[outcomeValue]) {
                groupedDataByOutcome[outcomeValue] = {}
                columnMetadata.fields.forEach((feature) => {
                    groupedDataByOutcome[outcomeValue][feature] = {}
                    groupedDataByOutcome[outcomeValue][feature]['values'] = []
                })
            }
            columnMetadata.numeric.forEach((feature) => {
                const featureValue = handleNull(row[feature]);
                if(featureValue || featureValue === 0) {
                    groupedDataByOutcome[outcomeValue][feature]['values'].push(featureValue);
                    groupedDataByOutcome['Sample'][feature]['values'].push(featureValue);
                    // groupedDataByOutcome['Sample'][feature][outcome].push(outcomeValueIdx);
                    groupedDataByOutcome['Sample'][feature][outcome].push(outcomeValue);
                }
            })
            columnMetadata.category.forEach((feature) => {
                const featureValue = handleNull(row[feature]);
                if(featureValue || featureValue === 0) {
                    const catFeatureValues = categoricalUniqueValues[feature];
                    if(!catFeatureValues.get(featureValue)) catFeatureValues.set(featureValue, 1);
                    const catFeatureValueIdx = Array.from(catFeatureValues.keys()).findIndex((val) => val === featureValue);
                    groupedDataByOutcome[outcomeValue][feature]['values'].push(featureValue);
                    groupedDataByOutcome['Sample'][feature]['values'].push(featureValue);
                    groupedDataByOutcome['Sample'][feature]['values_encoded'].push(catFeatureValueIdx);
                    // groupedDataByOutcome['Sample'][feature][outcome].push(outcomeValueIdx);
                    groupedDataByOutcome['Sample'][feature][outcome].push(outcomeValue);
                }
            })
        }
    });
    return groupedDataByOutcome
}

export const calculateStatisticsByCategory = (dataByFeatureRows, columnMetadata, outcomeCol) => {
    // Group data by category
    const statsByOutcome = {}
    const uniqueOutcomeValues = Object.keys(dataByFeatureRows).filter((val) => val !== 'Sample') 
    // Calculate statistics for each category
    Object.keys(dataByFeatureRows).forEach((outcome) => {
        const statsByFeature = {}
        const valuesByFeature = dataByFeatureRows[outcome];
        for (const numericField of columnMetadata.numeric) {
            const values = valuesByFeature[numericField]['values'];
            const mean = jStat.mean(values);
            const variance = jStat.variance(values);
            const stdDeviation = jStat.stdev(values);
            const notNullCount = values.length;
            statsByFeature[numericField] = {
                mean, variance, stdDeviation, notNullCount
            }
        };
        for (const catField of columnMetadata.category) {
            const values = valuesByFeature[catField]['values'];
            const notNullCount = values.length;
            const countsMap = new Map();
            values.forEach(item => {
                countsMap.set(item, (countsMap.get(item) || 0) + 1);
            });
            statsByFeature[catField] = {notNullCount, values: {}}
            for (const catValue of countsMap.keys()) {
                const count = countsMap.get(catValue);
                const pct = ((100 * count) / notNullCount).toFixed(1)
                statsByFeature[catField]['values'][catValue] = {
                    count, pct
                }
            }
        }
        statsByOutcome[outcome] = statsByFeature
    });
    const pvalueByFeature = {}
    const valuesByFeature = dataByFeatureRows['Sample'];
    for (const numericField of columnMetadata.numeric) {
        const values = valuesByFeature[numericField]['values'];
        const corrCoefs = calculateCorrelationAndPValue(values, valuesByFeature[numericField][outcomeCol])
        pvalueByFeature[numericField] = {
            ...corrCoefs
        }
    }
    for (const catField of columnMetadata.category) {
        const values = valuesByFeature[catField]['values_encoded'];
        const corrCoefs = calculateCorrelationCategoryField(values, valuesByFeature[catField][outcomeCol], uniqueOutcomeValues)
        pvalueByFeature[catField] = {
            ...corrCoefs
        }

    };
    statsByOutcome['pvalue'] = pvalueByFeature;
    return statsByOutcome;
  };