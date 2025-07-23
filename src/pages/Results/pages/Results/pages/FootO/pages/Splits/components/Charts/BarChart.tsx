import React from "react"
import { BarDatum, ResponsiveBar } from "@nivo/bar"
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import { formatTime } from "../utils/chartDataTransform"
import { CHART_COLOR_CONFIGS } from "../../../../../../../../../../utils/accessibleColors.ts"

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
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  if (!data || data.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={300}
        bgcolor="grey.50"
        borderRadius={1}
      >
        <Typography variant="h6" color="text.secondary">
          Selecciona corredores para ver el gráfico de barras
        </Typography>
      </Box>
    )
  }

  // Dinamically calculate height based on number of runners
  const barHeight = 40
  const chartHeight = Math.max(300, data.length * barHeight + 100) // +100 for padding and axis

  const chartData: ChartDataItem[] = data.map((runner) => ({
    name: runner.name,
    errorFreeTime: Math.max(0, runner.errorFreeTime || 0),
    errorTime: Math.max(0, runner.errorTime || 0),
    totalTime: runner.totalTime,
    runnerId: runner.runnerId,
    theoreticalTime: runner.theoreticalTime ?? 0,
  }))

  const validatedData = chartData.map((runner) => {
    const sum = runner.errorFreeTime + runner.errorTime
    if (sum > runner.totalTime && runner.totalTime > 0) {
      const ratio = runner.totalTime / sum
      return {
        ...runner,
        errorFreeTime: runner.errorFreeTime * ratio,
        errorTime: runner.errorTime * ratio,
      }
    }
    return runner
  })

  return (
    <Box width="100%">
      <Box height={chartHeight} width="100%">
        <ResponsiveBar
          data={validatedData as BarDatum[]}
          keys={["errorFreeTime", "errorTime"]}
          indexBy="name"
          margin={{
            top: 50,
            right: isMobile ? 20 : 30,
            bottom: 50,
            left: 150,
          }}
          padding={0.3}
          layout="horizontal"
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={({ id }) => {
            if (id === "errorTime") return CHART_COLOR_CONFIGS.bar.errorTime
            if (id === "errorFreeTime") return CHART_COLOR_CONFIGS.bar.errorFreeTime
            return CHART_COLOR_CONFIGS.bar.theoreticalTime
          }}
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
            legend: "Tiempo (segundos)",
            legendPosition: "middle",
            legendOffset: 40,
            format: (value) => formatTime(Number(value)),
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: data.length > 6 ? -15 : 0,
          }}
          enableLabel={true}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          label={(d) => {
            const value = Number(d.value)
            return value > 30 ? formatTime(value) : ""
          }}
          tooltip={({ indexValue, data }) => {
            const errorTime = Number(data.errorTime) || 0
            const errorFreeTime = Number(data.errorFreeTime) || 0
            const total = errorTime + errorFreeTime
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
                  Tiempo perdido (loss time): {formatTime(errorTime)}
                </Typography>
                {total > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Eficiencia: {((errorFreeTime / total) * 100).toFixed(1)}%
                  </Typography>
                )}
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
            grid: {
              line: {
                stroke: "#dddddd",
                strokeWidth: 1,
              },
            },
          }}
        />
      </Box>

      {/* Leyenda personalizada debajo */}
      <Box
        mt={2}
        display="flex"
        flexDirection="row"
        gap={3}
        flexWrap="wrap"
        justifyContent="center"
      >
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "4px",
              backgroundColor: CHART_COLOR_CONFIGS.bar.errorFreeTime,
              marginRight: 1,
            }}
          />
          <Typography variant="body2">Tiempo sin errores</Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "4px",
              backgroundColor: CHART_COLOR_CONFIGS.bar.errorTime,
              marginRight: 1,
            }}
          />
          <Typography variant="body2">Tiempo de error (pérdida)</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default BarChart
