import jStat from 'jstat';
import {chiSquaredGoodnessOfFit} from 'simple-statistics';

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


const calculateCorrelationAndPValue = (colA, colB) => {

    
    // Standardize both columns
    const standardizedColA = standardize(colA);
    const standardizedColB = standardize(colB);
    // Calculate Pearson correlation coefficient
    const correlationCoefficient = jStat.corrcoeff(standardizedColA, standardizedColB);

    // // Calculate p-value for the correlation coefficient
    const n = standardizedColA.length;
    const pValue = jStat.ttest(correlationCoefficient, n - 2, 2);

    // // Fisher transformation to Z-score
    // const transformed = 0.5 * Math.log((1 + correlationCoefficient) / (1 - correlationCoefficient));
    // const standardError = 1 / Math.sqrt(n - 3); // For Pearson correlation

    // // Calculate Z-score
    // const zScore = transformed / standardError;
    // console.log( zScore , transformed,  standardError)


    // // Calculate the p-value from the Z-score
    // const pValue = 2 * jStat.normal.cdf(-Math.abs(zScore)); // For two-tailed test
    return {correlationCoefficient, pValue}
}

const calculateCorrelationNumericField = (values) => {
    // Assuming outcome is categorical
    const anovaResult = {F: jStat.anovafscore(values), p: jStat.anovaftest(...values)};
    console.log('One-Way ANOVA Result:');
    console.log('F-Statistic:', anovaResult.F);
    console.log('P-Value:', anovaResult.p);
    return {coef: anovaResult.F, pValue: anovaResult.p}
}

const calculateCorrelationCategoryField = (observed) => {
    // Assuming outcome is categorical
    // Perform Chi-Square test
    const chiSquareResult = chiSquaredGoodnessOfFit(observed);

    console.log('Chi-Square Test Result:');
    console.log('Chi-Square Statistic:', chiSquareResult);
    console.log('Degrees of Freedom:', chiSquareResult.df);
    console.log('P-Value:', chiSquareResult.p);
    return {coef: chiSquareResult.df, pValue: chiSquareResult.p}
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
        const corrCoefs = calculateCorrelationNumericField(Object.values(dataByOutcomeValues))
        // const  corrCoefs = calculateCorrelationAndPValue(totalSample[feature]['values'], totalSample[feature][outcome])
        correlationMetrics[feature] = corrCoefs;
    })
    columnMetadata.category.forEach((feature) => {
        const dataByOutcomeValues = {};
        const standardizedValues = standardize(totalSample[feature]['values_encoded']);
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

export const getDataByFeatures = (data, features, outcome) => {
    const groupedDataByOutcome = {}
    groupedDataByOutcome['Sample'] = {}
    features.forEach((feature) => {
        groupedDataByOutcome['Sample'][feature] = []
    })
    data.forEach((row) => {
        const outcomeValue = row[outcome];
        if(outcomeValue || outcomeValue === 0){
            if(!groupedDataByOutcome[outcomeValue]) {
                groupedDataByOutcome[outcomeValue] = {}
                features.forEach((feature) => {
                    groupedDataByOutcome[outcomeValue][feature] = []
                })
            }
            features.forEach((feature) => {
                const featureValue = row[feature];
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
        const outcomeValue = row[outcome];
        if(outcomeValue || outcomeValue === 0){
            if(!outcomeValues.get(outcomeValue)) outcomeValues.set(outcomeValue, 1);
            const outcomeValueIdx = Array.from(outcomeValues.keys()).findIndex((val) => val === outcomeValue);
            if(!groupedDataByOutcome[outcomeValue]) {
                groupedDataByOutcome[outcomeValue] = {}
                columnMetadata.fields.forEach((feature) => {
                    groupedDataByOutcome[outcomeValue][feature] = {}
                    groupedDataByOutcome[outcomeValue][feature]['values'] = []
                })
            }
            columnMetadata.numeric.forEach((feature) => {
                const featureValue = row[feature];
                if(featureValue || featureValue === 0) {
                    groupedDataByOutcome[outcomeValue][feature]['values'].push(featureValue);
                    groupedDataByOutcome['Sample'][feature]['values'].push(featureValue);
                    groupedDataByOutcome['Sample'][feature][outcome].push(outcomeValueIdx);
                }
            })
            columnMetadata.category.forEach((feature) => {
                const featureValue = row[feature];
                if(featureValue || featureValue === 0) {
                    const catFeatureValues = categoricalUniqueValues[feature];
                    if(!catFeatureValues.get(featureValue)) catFeatureValues.set(featureValue, 1);
                    const catFeatureValueIdx = Array.from(catFeatureValues.keys()).findIndex((val) => val === featureValue);
                    groupedDataByOutcome[outcomeValue][feature]['values'].push(featureValue);
                    groupedDataByOutcome['Sample'][feature]['values'].push(featureValue);
                    groupedDataByOutcome['Sample'][feature]['values_encoded'].push(catFeatureValueIdx);
                    groupedDataByOutcome['Sample'][feature][outcome].push(outcomeValueIdx);
                }
            })
        }
    });
    return groupedDataByOutcome
}

export const calculateStatisticsByCategory = (dataByFeatureRows, columnMetadata, outcomeCol) => {
    // Group data by category
    const statsByOutcome = {}
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
    };
    for (const catField of columnMetadata.category) {
        const values = valuesByFeature[catField]['values_encoded'];
        const corrCoefs = calculateCorrelationAndPValue(values, valuesByFeature[catField][outcomeCol])
        pvalueByFeature[catField] = {
            ...corrCoefs
        }
    };
    statsByOutcome['pvalue'] = pvalueByFeature;
    return statsByOutcome;
  };