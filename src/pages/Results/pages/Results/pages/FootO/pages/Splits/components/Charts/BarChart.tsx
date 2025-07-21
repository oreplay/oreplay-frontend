import React from "react"
import { ResponsiveBar, BarDatum } from "@nivo/bar"
import { Box, Typography } from "@mui/material"
import { formatTime } from "../utils/chartDataTransform"

export interface ChartDataItem {
  name: string
  errorFreeTime: number
  errorTime: number
  totalTime: number
  runnerId: string
  theoreticalTime: number
  [key: string]: string | number
}

interface BarChartProps {
  data: ChartDataItem[]
  height?: number
}

const BarChart: React.FC<BarChartProps> = ({ data, height = 400 }) => {
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
        data={chartData as BarDatum[]}
        keys={["errorFreeTime", "errorTime"]}
        indexBy="name"
        margin={{ top: 50, right: 130, bottom: 50, left: 150 }}
        padding={0.3}
        layout="horizontal"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ id }) => (id === "errorTime" ? "#ff4444" : "#44aa44")}
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
          legend: "Tiempo Sin Errores (tiempo sin errores)",
          legendPosition: "middle",
          legendOffset: 32,
          format: (value) => formatTime(Number(value)),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        enableLabel={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#ffffff"
        label={(d) => formatTime(Number(d.value))}
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
              { id: "errorFreeTime", label: "Tiempo sin errores", color: "#44aa44" },
              { id: "errorTime", label: "Tiempo de error", color: "#ff4444" },
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
          const errorTime = Number(data.errorTime) || 0
          const errorFreeTime = Number(data.errorFreeTime) || 0
          const total = errorTime > 0 ? errorFreeTime + errorTime : errorFreeTime

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
