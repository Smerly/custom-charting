"use client"

import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { scaleOrdinal } from "@visx/scale"
import { Text } from "@visx/text"
import type { TimeData } from "./interfaces"

// Random Dummy Data
const timeData: TimeData = {
  0: [
    { label: "Category A", value: 40 },
    { label: "Category B", value: 30 },
    { label: "Category C", value: 20 },
    { label: "Category D", value: 10 },
  ],
  25: [
    { label: "Category A", value: 25 },
    { label: "Category B", value: 35 },
    { label: "Category C", value: 30 },
    { label: "Category D", value: 10 },
  ],
  50: [
    { label: "Category A", value: 15 },
    { label: "Category B", value: 45 },
    { label: "Category C", value: 25 },
    { label: "Category D", value: 15 },
  ],
  75: [
    { label: "Category A", value: 30 },
    { label: "Category B", value: 20 },
    { label: "Category C", value: 35 },
    { label: "Category D", value: 15 },
  ],
  100: [
    { label: "Category A", value: 35 },
    { label: "Category B", value: 25 },
    { label: "Category C", value: 20 },
    { label: "Category D", value: 20 },
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
  const width = 400
  const height = 400
  const radius = Math.min(width, height) / 2
  const centerY = height / 2
  const centerX = width / 2

  const data = timeData[0]
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className="flex flex-col items-center space-y-8">

      {/* Pie Chart */}
      
      <div className="relative w-[400px] h-[400px]">
        <svg width={width} height={height}>
          <Group top={centerY} left={centerX}>
            <Pie
              data={data}
              pieValue={(d) => d.value}
              outerRadius={radius - 40}
              innerRadius={radius - 80}
              cornerRadius={3}
              padAngle={0.02}
            >
              {(pie) => (
                  <>
                    {pie.arcs.map((arc, i) => {
                      const [centroidX, centroidY] = pie.path.centroid(arc)
                      const percentage = ((arc.data.value / total) * 100).toFixed(1)
                      return (
                        <g key={`arc-${i}`}>
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
          </Group>
        </svg>
      </div>

      {/* Data Displayers */}

      <div className="flex flex-wrap justify-center gap-4">
        {data.map((item) => (
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