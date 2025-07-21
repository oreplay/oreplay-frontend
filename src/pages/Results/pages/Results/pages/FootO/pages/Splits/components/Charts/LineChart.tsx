import React from "react"
import { ResponsiveLine } from "@nivo/line" // Import responsive line chart from Nivo
import { Box, Typography } from "@mui/material" // Import Material-UI components for layout and text
import {
  LineChartData,
  ChartDataPoint,
  formatTime,
  formatTimeDifference,
} from "../utils/chartDataTransform" // Utilities for data formatting and types

interface LineChartProps {
  data: LineChartData[] // Array of data sets for the chart
  height?: number // Optional height for the chart container, default value set later
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 400 }) => {
  // Debug logging
  console.log("LineChart received data:", data)

  // If no data is passed, show a message prompting the user to select runners
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
          Selecciona corredores para ver el gráfico de líneas
        </Typography>
      </Box>
    )
  }

  // Render the responsive line chart when data is available
  return (
    <Box height={height}>
      <ResponsiveLine
        data={data} // The data to plot
        margin={{ top: 50, right: 110, bottom: 50, left: 80 }} // Margins around chart for labels, legends, etc.
        xScale={{ type: "point" }} // X axis treats values as categorical points
        yScale={{
          type: "linear",
          min: 0,
          max: "auto", // Auto-scale max based on data
          stacked: false,
          reverse: true, // Reverse Y axis (likely because smaller times are better)
        }}
        yFormat={(value) => formatTime(Number(value))} // Format Y axis values as time strings
        axisTop={null} // No top axis
        axisRight={null} // No right axis
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45, // Rotate X ticks for readability
          legend: "Controles", // X axis label
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: -60,
          legendPosition: "middle",
          format: (value) => formatTime(Number(value)), // Format Y axis ticks as time
        }}
        pointSize={8} // Size of points on the line
        pointColor={{ theme: "background" }} // Points color based on a theme background
        pointBorderWidth={2} // Width of a point border
        pointBorderColor={{ from: "serieColor" }} // Border color matches series color
        pointLabelYOffset={-12} // Offset of point labels vertically
        useMesh={true} // Enables mesh for better tooltip detection
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)", // Highlight legend item on hover
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        tooltip={({ point }) => {
          // Custom tooltip for each data point
          const data = (point as { data: ChartDataPoint }).data

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
              {/* Runner name displayed prominently */}
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                {data.runnerName}
              </Typography>

              {/* Race time behind leader, formatted as time difference */}
              <Typography variant="body2" mb={0.5}>
                Race Time Behind Leader: {formatTimeDifference(data.timeBehindLeader)}
              </Typography>

              {/* Time behind the best partial split */}
              <Typography variant="body2">
                Time Behind Best Partial:{" "}
                {formatTimeDifference(data.timeBehindBestPartialIncremental)}
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

export default LineChart
