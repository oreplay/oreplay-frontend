import React from "react"
import { ResponsiveRadar } from "@nivo/radar"
import { Box, Typography } from "@mui/material"
import { formatTime } from "../utils/chartDataTransform"

interface RadarDataPoint {
  control: string
  actualTime: number
  normalizedTime: number
  bestTime: number
}

export interface RadarChartData {
  runnerId: string
  runnerName: string
  data: RadarDataPoint[]
}

interface RadarDatum {
  control: string
  [runnerName: string]: number | string
}

interface RadarChartProps {
  data: RadarChartData[]
  height?: number
}

interface SliceTooltipProps {
  slice: {
    data: {
      control: string
    }
    points: Array<{
      color: string
      data: unknown
    }>
  }
}

const RadarChart: React.FC<RadarChartProps> = ({ data, height = 400 }) => {
  // Debug logging
  console.log("RadarChart received data:", data)

  if (!data || data.length === 0 || data.length > 2) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={height}
        bgcolor="grey.50"
        borderRadius={1}
      >
        <Typography variant="h6" color="text.secondary" textAlign="center" px={2}>
          {!data || data.length === 0
            ? "Selecciona 1-2 corredores para el gráfico radar"
            : "Máximo 2 corredores permitidos para gráfico radar"}
        </Typography>
      </Box>
    )
  }

  const allControls = new Set<string>()
  data.forEach((runner) => {
    runner.data.forEach((point) => {
      allControls.add(point.control)
    })
  })

  const controlsList = Array.from(allControls).sort()

  const radarData: RadarDatum[] = controlsList.map((control) => {
    const dataPoint: RadarDatum = { control }

    data.forEach((runner) => {
      const point = runner.data.find((p) => p.control === control)
      const normalizedValue = point ? 2.0 - point.normalizedTime : 0
      dataPoint[runner.runnerName] = Math.max(0.1, normalizedValue)
    })

    return dataPoint
  })

  const keys = data.map((runner) => runner.runnerName)

  const sliceTooltipFn: React.FC<SliceTooltipProps> = (props) => {
    const slice = props.slice
    const control = slice.data.control

    const controlInfo = data.flatMap((runner) =>
      runner.data
        .filter((point) => point.control === control)
        .map((point) => ({ runner, point }))
    )

    const points = slice.points

    return (
      <Box
        sx={{
          background: "white",
          padding: 2,
          border: "1px solid #ccc",
          borderRadius: 1,
          boxShadow: 2,
          minWidth: 200,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
          Control: {control}
        </Typography>

        {controlInfo.map(({ runner, point }, idx) => (
          <Box key={idx} mb={1}>
            <Typography variant="body2" color={points[idx]?.color || "black"}>
              {runner.runnerName}
            </Typography>
            <Typography variant="body2" fontSize="0.8rem">
              Tiempo: {formatTime(point.actualTime)}
            </Typography>
            <Typography variant="body2" fontSize="0.8rem">
              Ratio vs mejor: {point.normalizedTime.toFixed(2)}x
            </Typography>
            <Typography variant="body2" fontSize="0.8rem">
              Mejor tiempo: {formatTime(point.bestTime)}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box height={height}>
      <ResponsiveRadar
        data={radarData}
        keys={keys}
        indexBy="control"
        maxValue={2}
        margin={{ top: 70, right: 150, bottom: 70, left: 150 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: "color" }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={16}
        enableDots={true}
        dotSize={8}
        dotColor={{ theme: "background" }}
        dotBorderWidth={2}
        dotBorderColor={{ from: "color" }}
        enableDotLabel={false}
        colors={{ scheme: "set1" }}
        fillOpacity={0.2}
        blendMode="multiply"
        animate={true}
        motionConfig="wobbly"
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 120,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 20,
            itemTextColor: "#333",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
        // casteamos a unknown para evitar el error TS sin usar any ni ignorar eslint
        sliceTooltip={sliceTooltipFn as React.FC<unknown>}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: "#777777",
                strokeWidth: 1,
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

      <Box mt={2}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          * Mayor distancia del centro = mejor rendimiento relativo
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          * Valores normalizados respecto al mejor tiempo por control
        </Typography>
      </Box>
    </Box>
  )
}

export default RadarChart
