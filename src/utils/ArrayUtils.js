export const mySplice = (yourArray, elementToRemove) => {
    const index = yourArray.indexOf(elementToRemove);    
    if (index !== -1) {
      return [...yourArray.slice(0, index), ...yourArray.slice(index+1)];
    } 
    return yourArray;
  }