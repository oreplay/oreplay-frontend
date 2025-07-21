import React from "react"
import { ResponsiveBar, BarDatum } from "@nivo/bar"
import { Box, Typography } from "@mui/material"
import { formatTime } from "../utils/chartDataTransform"

// Interface representing a single runner's data structure for the bar chart
export interface ChartDataItem {
  name: string
  errorFreeTime: number
  errorTime: number
  totalTime: number
  runnerId: string
  theoreticalTime: number
  [key: string]: string | number
}

// Props for the BarChart component
interface BarChartProps {
  data: ChartDataItem[]
  height?: number // Optional height for the chart container
}

const BarChart: React.FC<BarChartProps> = ({ data, height = 400 }) => {
  // Debug logging
  console.log("BarChart received data:", data)

  // If there is no data, display a placeholder message
  if (!data || data.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={height}
        bgcolor="grey.50"
        borderRadius={1}
      >
        <Typography variant="h6" color="text.secondary">
          Selecciona corredores para ver el gráfico de barras
        </Typography>
      </Box>
    )
  }

  // Normalize input data to ensure `theoreticalTime` is defined
  const chartData: ChartDataItem[] = data.map((runner) => ({
    name: runner.name,
    errorFreeTime: runner.errorFreeTime,
    errorTime: runner.errorTime,
    totalTime: runner.totalTime,
    runnerId: runner.runnerId,
    theoreticalTime: runner.theoreticalTime ?? 0,
  }))

  return (
    <Box height={height}>
      <ResponsiveBar
        data={chartData as BarDatum[]} // Type cast required due to flexible keys
        keys={["errorFreeTime", "errorTime"]} // Bars are composed of these two stacked values
        indexBy="name" // Each bar represents a runner, indexed by their name
        margin={{ top: 50, right: 130, bottom: 50, left: 150 }}
        padding={0.3}
        layout="horizontal" // Horizontal bar layout for better readability with runner names
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ id }) => (id === "errorTime" ? "#ff4444" : "#44aa44")} // Color coding: red for error, green for clean time
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Tiempo Sin Errores (tiempo sin errores)", // X-axis label
          legendPosition: "middle",
          legendOffset: 32,
          format: (value) => formatTime(Number(value)), // Format tick values as time strings
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Corredores", // Y-axis label
          legendPosition: "middle",
          legendOffset: -100,
        }}
        enableLabel={true} // Enable bar labels
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        labelFormat={(value) => formatTime(Number(value))} // Format bar labels as time strings
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            data: [
              {
                id: "errorFreeTime",
                label: "Tiempo sin errores",
                color: "#44aa44",
              },
              {
                id: "errorTime",
                label: "Tiempo de error",
                color: "#ff4444",
              },
            ],
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        tooltip={({ indexValue, data }) => {
          // Custom tooltip showing detailed breakdown of each runner's times
          const errorTime = data.errorTime as number
          const errorFreeTime = data.errorFreeTime as number
          const total = errorFreeTime + errorTime

          return (
            <Box
              sx={{
                background: "white",
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 1,
                boxShadow: 2,
                minWidth: 250,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                {indexValue}
              </Typography>

              <Typography variant="body2" mb={0.5}>
                Tiempo total mostrado: {formatTime(total)}
              </Typography>

              <Typography variant="body2" mb={0.5} color="#44aa44">
                Tiempo sin errores: {formatTime(errorFreeTime)}
              </Typography>

              <Typography variant="body2" mb={1} color="#ff4444">
                Tiempo perdido (error): {formatTime(errorTime)}
              </Typography>
            </Box>
          )
        }}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
            },
            legend: {
              text: {
                fontSize: 12,
                fill: "#333333",
              },
            },
            ticks: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
              },
              text: {
                fontSize: 11,
                fill: "#333333",
              },
            },
          },
          legends: {
            text: {
              fontSize: 11,
              fill: "#333333",
            },
          },
          grid: {
            line: {
              stroke: "#dddddd",
              strokeWidth: 1,
            },
          },
        }}
      />
    </Box>
  )
}

export default BarChart
