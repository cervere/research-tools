export const getColumnDTypes = (datasetByFeature) => {
    const featureDTypes = {}
    Object.keys(datasetByFeature).forEach((feature) => {
      featureDTypes[feature] = getDType(datasetByFeature[feature].slice(0, 10))
    })
    return featureDTypes;
  }

export const getDType = (sample) => {
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