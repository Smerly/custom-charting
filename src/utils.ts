
export const generateData = (categories: string[]) => {
    let openSpace = 100
    return categories.map((category, i) => {
        const currentSpace = i === categories.length - 1 
        ? openSpace 
        : Math.floor(Math.random() * (openSpace - categories.length + i + 1) + 1);
      openSpace -= currentSpace
      console.log(`currentSpace: ${currentSpace}`)
      return {id: i, label: category, value: currentSpace}
    })
  }