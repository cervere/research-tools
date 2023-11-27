import jStat from 'jstat';

const calculateCorrelationAndPValue = (colA, colB) => {
    // Calculate Pearson correlation coefficient
    const correlationCoefficient = jStat.corrcoeff(colA, colB);

    // Calculate p-value for the correlation coefficient
    const n = colA.length;
    const pValue = jStat.ttest(correlationCoefficient, n - 2, 2);

    return {correlationCoefficient, pValue}
}

export const getCorrelationCoeffs = (dataByFeatureRows, columnMetadata, outcome) => {
    const correlationMetrics = {}
    const totalSample = dataByFeatureRows['Sample']
    columnMetadata.numeric.forEach((feature) => {
        const  corrCoefs = calculateCorrelationAndPValue(totalSample[feature]['values'],
                                                        totalSample[feature][outcome])
        correlationMetrics[feature] = corrCoefs;
    })
    columnMetadata.category.forEach((feature) => {
        const  corrCoefs = calculateCorrelationAndPValue(totalSample[feature]['values_encoded'],
                                                        totalSample[feature][outcome])
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
        ([...columnMetadata.category]).forEach((catField) => {
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
        })
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