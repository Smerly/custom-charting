"use client"

import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { scaleOrdinal } from "@visx/scale"
import { Text } from "@visx/text"
import type { TimeData } from "./interfaces"
import { useState } from "react"
import { Slider } from "../ui/slider"
import { Button } from "../ui/button"
import { useSpring, animated } from '@react-spring/web'

// Random Dummy Data
const timeData: TimeData = {
  0: [
    { id: 1, label: "Category A", value: 40 },
    { id: 2, label: "Category B", value: 30 },
    { id: 3, label: "Category C", value: 20 },
    { id: 4, label: "Category D", value: 10 },
  ],
  25: [
    { id: 1, label: "Category A", value: 25 },
    { id: 2, label: "Category B", value: 35 },
    { id: 3, label: "Category C", value: 30 },
    { id: 4, label: "Category D", value: 10 },
  ],
  50: [
    { id: 1, label: "Category A", value: 15 },
    { id: 2, label: "Category B", value: 45 },
    { id: 3, label: "Category C", value: 25 },
    { id: 4, label: "Category D", value: 15 },
  ],
  75: [
    { id: 1, label: "Category A", value: 30 },
    { id: 2, label: "Category B", value: 20 },
    { id: 3, label: "Category C", value: 35 },
    { id: 4, label: "Category D", value: 15 },
  ],
  100: [
    { id: 1, label: "Category A", value: 35 },
    { id: 2, label: "Category B", value: 25 },
    { id: 3, label: "Category C", value: 20 },
    { id: 4, label: "Category D", value: 20 },
  ],
}

// Color scale domain range
const colors = [
  "#FF6F61", // Coral 
  "#6B5B95", // Lavender
  "#88B04B", // Olive Green
  "#F1C40F", // Golden Yellow 
];
const getColor = scaleOrdinal({ 
  domain: ["Category A", "Category B", "Category C", "Category D"],
  range: colors,
})

export function PieChart() {
  // state
  const [timePosition, setTimePosition] = useState(0)
  const [pieScale, setPieScale] = useState(1)


  // helper functions

  const getCurrentData = (position: number) => {
    const timePoints = Object.keys(timeData).map(Number)
    const closestTime = timePoints.reduce((previous, current) => {
      return Math.abs(current - position) < Math.abs(previous - position) ? current : previous
    })
    return timeData[closestTime]
  }

  // util vars
  const width = 400
  const height = 400
  const radius = Math.min(width, height) / 2
  const centerY = height / 2
  const centerX = width / 2

  const currentData = getCurrentData(timePosition)
  const total = currentData.reduce((sum, entry) => sum + entry.value, 0)

  // Animation
  const pieProps = useSpring({
    from: { scale: 0 },
    to: { scale: pieScale === 0 ? 1 : 0 },
  })

  return (
    <div className="flex flex-col items-center space-y-8">

      {/* Pie Chart */}
      
      <div className="relative w-[400px] h-[400px]">
        <svg width={width} height={height}>
          <Group top={centerY} left={centerX}>
            <animated.g style={{ ...pieProps }}>
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
                      {pie.arcs.map((arc) => {
                        const key = arc.data.id || arc.index;
                        const [centroidX, centroidY] = pie.path.centroid(arc) ?? [0, 0];
                        const percentage = ((arc.data.value / total) * 100).toFixed(1);
                        return (
                          <g key={key}>
                            <path d={pie.path(arc) || ""} fill={getColor(arc.data.label)} />
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
            </animated.g>
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
        {currentData.map((item) => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-foreground" style={{ backgroundColor: getColor(item.label) }} />
            <span className="text-sm">
              {item.label}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}