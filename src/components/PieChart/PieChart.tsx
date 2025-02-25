"use client"

import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { scaleOrdinal } from "@visx/scale"
import { Text } from "@visx/text"
import type { TimeData } from "./interfaces"
import { useEffect, useState } from "react"
import { Slider } from "../ui/slider"
import { Button } from "../ui/button"
import { generateData } from "@/utils"
import { AnimatePresence, motion } from 'framer-motion'

export function PieChart() {
  // state
  const [timePosition, setTimePosition] = useState(0)
  const [chartData, setChartData] = useState<TimeData | null>(null)
  const [pieScale, setPieScale] = useState(1)


  // helper functions

  const getCurrentData = (position: number) => {
    if (!chartData) return
    const timePoints = Object.keys(chartData).map(Number)
    const closestTime = timePoints.reduce((previous, current) => {
      return Math.abs(current - position) < Math.abs(previous - position) ? current : previous
    })
    return chartData[closestTime]
  }

  // util vars
  const width = 400
  const height = 400
  const radius = Math.min(width, height) / 2
  const centerY = height / 2
  const centerX = width / 2

  const currentData = getCurrentData(timePosition)
  const total = currentData?.reduce((sum, entry) => sum + entry.value, 0) ?? 0

  const pieCategories = ["Category A", "Category B", "Category C", "Category D"]
  // Color scale domain range
  const colors = ["#FF6F61", "#6B5B95", "#88B04B", "#F1C40F"];
  const getColor = scaleOrdinal({
    domain: pieCategories,
    range: colors,
  })

  useEffect(() => {
    const timeData: TimeData = {
      0: generateData(pieCategories),
      25: generateData(pieCategories),
      50: generateData(pieCategories),
      75: generateData(pieCategories),
      100: generateData(pieCategories),
    }
    setChartData(timeData)
  }, [])

  return (
    <div className="flex flex-col items-center space-y-8">

      {/* Pie Chart */}

      <div className="relative w-[400px] h-[400px]">
        <svg width={width} height={height}>
          <Group top={centerY} left={centerX}>
            <AnimatePresence>
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: pieScale }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ transformOrigin: "center" }}
              >
                <Pie
                  data={currentData}
                  pieValue={(d) => d.value}
                  outerRadius={radius - 40}
                  innerRadius={radius - 80}
                  cornerRadius={3}
                  padAngle={0.02}
                >
                  {(pie) => (
                    <>
                      {pie.arcs.map((arc, i) => {
                        const key = arc.data.id ?? i;
                        const [centroidX, centroidY] = pie.path.centroid(arc) ?? [0, 0];
                        const percentage = ((arc.data.value / total) * 100).toFixed(1);
                        return (
                          <g key={key}>
                            <path d={pie.path(arc) ?? ""} fill={getColor(arc.data.label)} />
                            <Text x={centroidX} y={centroidY} textAnchor="middle" fill="white" fontSize={14} dy=".33em">
                              {/* Type bug requires it like this */}
                              {`${percentage}%`}
                            </Text>
                          </g>
                        )
                      })}
                    </>
                  )}
                </Pie>
              </motion.g>
            </AnimatePresence>
          </Group>
        </svg>
      </div>

      {/* Slider */}

      <div className="flex flex-col justify-center items-center w-full max-w-md space-y-2">
        <div className="text-sm text-muted-foreground text-center mb-2">Time Position: {timePosition}%</div>
        <Slider value={[timePosition]} onValueChange={(value) => setTimePosition(value[0])} max={100} step={1} />
        <Button className="mt-20" onClick={() => setPieScale((pieScale) => pieScale === 0 ? 1 : 0)}>{pieScale === 0 ? "Hide Chart" : 'Show Chart'}</Button>
      </div>

      {/* Data Displayers */}

      <div className="flex flex-wrap justify-center gap-4">
        {currentData ? currentData?.map((item) => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-foreground" style={{ backgroundColor: getColor(item.label) }} />
            <span className="text-sm">
              {item.label}: {item.value}%
            </span>
          </div>
        )) : (
          <p> No Data to be Rendered. </p>
        )}
      </div>
    </div>
  )
}