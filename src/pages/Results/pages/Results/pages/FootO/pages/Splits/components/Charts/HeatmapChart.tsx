import React from "react"
import { ResponsiveHeatMap } from "@nivo/heatmap"
import { Box, Typography } from "@mui/material"
import { HeatmapData, formatTime } from "../utils/chartDataTransform"

interface HeatmapChartProps {
  data: HeatmapData[]
  height?: number
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, height = 400 }) => {
  // Debug logging
  console.log("HeatmapChart received data:", data)

  // If there's no data, show a placeholder message
  if (!data || data.length === 0 || data[0]?.data?.length === 0) {
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
          No hay suficientes datos para el mapa de calor
        </Typography>
      </Box>
    )
  }

  // Transform data for Nivo heatmap format
  const heatmapData = data[0].data

  // Get unique runners and controls for the heatmap grid
  const uniqueRunners = [...new Set(heatmapData.map(d => d.runner))].sort()
  const uniqueControls = [...new Set(heatmapData.map(d => d.control))].sort()

  // Transform to Nivo format: array of runner objects with control values
  const nivoData = uniqueRunners.map(runner => {
    const runnerData: { [key: string]: string | number } = { id: runner }

    uniqueControls.forEach(control => {
      const dataPoint = heatmapData.find(d => d.runner === runner && d.control === control)
      runnerData[control] = dataPoint ? dataPoint.value : 0
    })

    return runnerData
  })

  // Determine min/max values for color scaling
  const allValues = heatmapData.map(d => d.value).filter(v => v > 0)
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)

  return (
    <Box height={height}>
      <ResponsiveHeatMap
        data={nivoData}
        keys={uniqueControls}
        indexBy="id"
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        cellOpacity={1}
        cellBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.4]]
        }}
        cellBorderWidth={1}
        colors={{
          type: 'diverging',
          scheme: 'red_blue',
          divergeAt: 0.5,
          minValue,
          maxValue
        }}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Controles',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Controles',
          legendPosition: 'middle',
          legendOffset: 40
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Corredores',
          legendPosition: 'middle',
          legendOffset: -60
        }}
        enableLabels={false}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.8]]
        }}
        legends={[
          {
            anchor: 'bottom',
            translateX: 0,
            translateY: 30,
            length: 400,
            thickness: 8,
            direction: 'row',
            tickPosition: 'after',
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            title: 'Posición / Tiempo Perdido →',
            titleAlign: 'start',
            titleOffset: 4
          }
        ]}
        tooltip={({ xKey, yKey, value }) => {
          const dataPoint = heatmapData.find(d =>
            d.runner === yKey && d.control === xKey
          )

          if (!dataPoint) return null

          return (
            <Box
              sx={{
                background: "white",
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 1,
                boxShadow: 2,
                minWidth: 200
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                {dataPoint.runnerName}
              </Typography>

              <Typography variant="body2" mb={0.5}>
                Control: {dataPoint.controlStation}
              </Typography>

              <Typography variant="body2" mb={0.5}>
                Posición: {Math.round(dataPoint.actualValue)}°
              </Typography>

              {dataPoint.actualValue !== dataPoint.value && (
                <Typography variant="body2" color="error">
                  Tiempo perdido: {formatTime(dataPoint.actualValue)}
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
                strokeWidth: 1
              }
            },
            legend: {
              text: {
                fontSize: 12,
                fill: "#333333"
              }
            },
            ticks: {
              line: {
                stroke: "#777777",
                strokeWidth: 1
              },
              text: {
                fontSize: 11,
                fill: "#333333"
              }
            }
          },
          legends: {
            text: {
              fontSize: 11,
              fill: "#333333"
            }
          }
        }}
      />

      {/* Info box explaining the heatmap */}
      <Box mt={2}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          * Colores más rojos = posición/tiempo peor, azules = mejor rendimiento
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          * Cada celda representa el rendimiento de un corredor en un control específico
        </Typography>
      </Box>
    </Box>
  )
}

export default HeatmapChart