import React from "react"
import { ResponsiveLine } from "@nivo/line"
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useTranslation } from "react-i18next"
import { formatTime } from "../utils/chartDataTransform"
import { getAccessibleColors } from "../../../../../../../../../../utils/accessibleColors.ts"

export interface PositionDataPoint {
  x: string
  y: number
  runnerName: string
  splitTime: number
  timeLost: number
  controlName?: string
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { t } = useTranslation()

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
          {t("positionChart.noData")}
        </Typography>
      </Box>
    )
  }

  const accessibleColors = getAccessibleColors(data.length)
  const dataWithColors = data.map((series, index) => ({
    ...series,
    color: accessibleColors[index],
  }))

  const dataWithCustomX: PositionChartData[] = dataWithColors.map((runner) => {
    const n = runner.data.length
    return {
      ...runner,
      data: runner.data.map((point, idx) => {
        let xLabel: string
        if (idx === 0) xLabel = "START"
        else if (idx === n - 1) xLabel = "FINISH"
        else xLabel = idx.toString()

        return {
          ...point,
          controlName: point.x,
          x: xLabel,
        }
      }),
    }
  })

  const maxPosition = Math.max(
    ...dataWithCustomX.flatMap((runner) => runner.data.map((point) => point.y)),
  )

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box height={height} width="100%">
        <ResponsiveLine
          data={dataWithCustomX}
          margin={{
            top: 50,
            right: isMobile ? 20 : 40,
            bottom: isMobile ? 120 : 50,
            left: 80,
          }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 1,
            max: Math.max(maxPosition, 10),
            reverse: true,
          }}
          axisTop={null}
          axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: t("positionChart.yAxisLabel"),
            legendOffset: 60,
            legendPosition: "middle",
            format: (value) => `${Math.round(Number(value))}°`,
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: t("positionChart.xAxisLabel"),
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: t("positionChart.yAxisLabel"),
            legendOffset: -60,
            legendPosition: "middle",
            format: (value) => `${Math.round(Number(value))}°`,
          }}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          enableArea={false}
          colors={(d) => d.color}
          lineWidth={3}
          useMesh={true}
          legends={[]}
          tooltip={({ point }) => {
            const data = point.data as PositionDataPoint
            if (data.x === "START" || data.x === "FINISH") return null

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
                  {data.runnerName}
                </Typography>

                <Typography variant="body2" mb={0.5}>
                  {t("positionChart.tooltip.control")}: {data.controlName}
                </Typography>

                <Typography variant="body2" mb={0.5}>
                  {t("positionChart.tooltip.position")}: {Math.round(data.y)}°
                </Typography>

                {data.splitTime > 0 && (
                  <Typography
                    variant="body2"
                    mb={0.5}
                    fontWeight={data.timeLost <= 0 ? "bold" : "normal"}
                  >
                    {t("positionChart.tooltip.splitTime")}: {formatTime(data.splitTime)}
                  </Typography>
                )}

                {data.timeLost > 0 && (
                  <Typography variant="body2" mb={0.5}>
                    {t("positionChart.tooltip.timeLost")}: +{formatTime(data.timeLost)}
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

      <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center" rowGap={1} columnGap={2}>
        {dataWithColors.map((series) => (
          <Box key={series.id} display="flex" alignItems="center" sx={{ minWidth: 100 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: series.color,
                marginRight: 1,
              }}
            />
            <Typography variant="body2">{series.id}</Typography>
          </Box>
        ))}
      </Box>

      <Box mt={1}>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          {t("positionChart.caption")}
        </Typography>
      </Box>
    </Box>
  )
}

export default PositionChart
