import { TimeData } from "./components/PieChart/interfaces";

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

export const getCurrentData = (position: number, chartData: TimeData | null) => {
    if (!chartData) return
    const timePoints = Object.keys(chartData).map(Number)
    const closestTime = timePoints.reduce((previous, current) => {
      return Math.abs(current - position) < Math.abs(previous - position) ? current : previous
    })
    return chartData[closestTime]
}