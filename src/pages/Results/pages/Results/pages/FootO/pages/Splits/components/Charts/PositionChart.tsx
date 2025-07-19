import React from "react"
import { ResponsiveLine } from "@nivo/line"
import { Box, Typography } from "@mui/material"
import { formatTime } from "../utils/chartDataTransform"

export interface PositionDataPoint {
  x: string
  y: number
  runnerName: string
  splitTime: number
  timeLost: number
}

export interface PositionChartData {
  id: string
  color: string
  data: PositionDataPoint[]
}

interface PositionChartProps {
  data: PositionChartData[]
  height?: number
}

const PositionChart: React.FC<PositionChartProps> = ({ data, height = 400 }) => {
  if (data.length === 0 || data.length > 2) {
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
          {data.length === 0
            ? "Selecciona 1-2 corredores para evolución de posición"
            : "Máximo 2 corredores permitidos"
          }
        </Typography>
      </Box>
    )
  }

  // Find the maximum position to set Y scale properly (inverted)
  const maxPosition = Math.max(
    ...data.flatMap(runner => runner.data.map(point => point.y))
  )

  return (
    <Box height={height}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 80 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 1,
          max: Math.max(maxPosition, 10),
          reverse: true // Invert Y-axis so position 1 is at top
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Controles",
          legendOffset: 36,
          legendPosition: "middle"
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Posición",
          legendOffset: -60,
          legendPosition: "middle",
          format: (value) => `${Math.round(Number(value))}°`
        }}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        enableArea={false}
        colors={{ scheme: "set1" }}
        lineWidth={3}
        useMesh={true}
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
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        tooltip={({ point }) => {
          // Aquí 'point.data' tiene tipo PositionDataPoint
          const data = point.data as PositionDataPoint

          return (
            <Box
              sx={{
                background: "white",
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 1,
                boxShadow: 2,
                minWidth: 250
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                {data.runnerName}
              </Typography>

              <Typography variant="body2" mb={0.5}>
                Control: {data.x}
              </Typography>

              <Typography variant="body2" mb={0.5}>
                Posición: {Math.round(data.y)}°
              </Typography>

              {data.splitTime > 0 && (
                <Typography variant="body2" mb={0.5}>
                  Tiempo parcial: {formatTime(data.splitTime)}
                </Typography>
              )}

              {data.timeLost > 0 && (
                <Typography variant="body2" mb={0.5}>
                  Tiempo perdido: +{formatTime(data.timeLost)}
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
          },
          grid: {
            line: {
              stroke: "#dddddd",
              strokeWidth: 1
            }
          }
        }}
      />

      {/* Info box */}
      <Box mt={1}>
        <Typography variant="caption" color="text.secondary">
          * Posición 1 arriba (mejor), posiciones más altas abajo (peor)
        </Typography>
      </Box>
    </Box>
  )
}

export default PositionChart
