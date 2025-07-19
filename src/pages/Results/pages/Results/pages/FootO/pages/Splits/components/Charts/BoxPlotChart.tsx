import React from "react"
import { ResponsiveBoxPlot, BoxPlotDatum, BoxPlotTooltipProps } from "@nivo/boxplot"
import { Box, Typography } from "@mui/material"
import { BoxPlotData, formatTime } from "../utils/chartDataTransform"

// Extendemos BoxPlotDatum para que incluya las propiedades que usamos
interface Datum extends BoxPlotDatum {
  group: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

interface BoxPlotChartProps {
  data: BoxPlotData[]
  height?: number
}

const CustomTooltip: React.FC<BoxPlotTooltipProps> = (props) => {
  // Casteamos props a objeto que contiene datum de tipo Datum
  const datum = (props as unknown as { datum: Datum }).datum

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
        Estadísticas del Control
      </Typography>
      <Typography variant="body2">Tiempo mediano: {formatTime(datum.median)}</Typography>
      <Typography variant="body2">Q1: {formatTime(datum.q1)}</Typography>
      <Typography variant="body2">Q3: {formatTime(datum.q3)}</Typography>
      <Typography variant="body2">Mínimo: {formatTime(datum.min)}</Typography>
      <Typography variant="body2">Máximo: {formatTime(datum.max)}</Typography>
    </Box>
  )
}

const BoxPlotChart: React.FC<BoxPlotChartProps> = ({ data, height = 400 }) => {
  if (data.length === 0 || data[0]?.data?.length === 0) {
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
          No hay datos suficientes para el gráfico de cajas
        </Typography>
      </Box>
    )
  }

  const boxPlotData: Datum[] = data[0].data.map((point) => ({
    group: point.controlStation,
    min: point.min,
    q1: point.q1,
    median: point.median,
    q3: point.q3,
    max: point.max,
  }))

  const theme = {
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
    translation: {}, // requerido por Nivo
  }

  return (
    <Box height={height}>
      <ResponsiveBoxPlot
        data={boxPlotData}
        margin={{ top: 50, right: 130, bottom: 80, left: 100 }}
        minValue="auto"
        maxValue="auto"
        colors={{ scheme: "set2" }}
        borderRadius={2}
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        medianWidth={2}
        medianColor={{
          from: "color",
          modifiers: [["darker", 0.8]],
        }}
        whiskerEndSize={0.6}
        whiskerColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Controles",
          legendPosition: "middle",
          legendOffset: 60,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Tiempo (segundos)",
          legendPosition: "middle",
          legendOffset: -80,
          format: (value) => formatTime(Number(value)),
        }}
        enableGridX={false}
        enableGridY={true}
        theme={theme}
        tooltip={CustomTooltip}
      />

      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          * La caja muestra Q1, mediana y Q3. Las líneas muestran min/max
        </Typography>
      </Box>
    </Box>
  )
}

export default BoxPlotChart
