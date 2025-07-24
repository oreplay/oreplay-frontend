import React from "react"
import { ResponsiveLine } from "@nivo/line"
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useTranslation } from "react-i18next"
import {
  LineChartData,
  ChartDataPoint,
  formatTime,
  formatTimeDifference,
} from "../utils/chartDataTransform"
import { getAccessibleColors } from "../../../../../../../../../../utils/accessibleColors.ts"

interface LineChartProps {
  data: LineChartData[]
  height?: number
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 400 }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { t } = useTranslation()

  const accessibleColors = getAccessibleColors(data.length)
  const dataWithColors = data.map((series, index) => ({
    ...series,
    color: accessibleColors[index],
  }))

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
          {t("lineChart.noData")}
        </Typography>
      </Box>
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box height={height} width="100%">
        <ResponsiveLine
          data={dataWithColors}
          margin={{
            top: 50,
            right: isMobile ? 20 : 40,
            bottom: 50,
            left: 80,
          }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
            reverse: true,
          }}
          yFormat={(value) => formatTime(Number(value))}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: t("lineChart.xAxisLabel"),
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -60,
            legendPosition: "middle",
            format: (value) => formatTime(Number(value)),
          }}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          colors={(d) => d.color}
          tooltip={({ point }) => {
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
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  {data.runnerName}
                </Typography>
                <Typography variant="body2" mb={0.5}>
                  {t("lineChart.tooltip.behindLeader")}:{" "}
                  {formatTimeDifference(data.timeBehindLeader)}
                </Typography>
                <Typography variant="body2">
                  {t("lineChart.tooltip.behindBestPartial")}:{" "}
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

      {/* Leyenda personalizada debajo del eje X */}
      <Box
        mt={2}
        mb={3} // <-- Aquí agregamos el margen inferior para crear espacio
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        rowGap={1}
        columnGap={2}
      >
        {dataWithColors.map((series) => (
          <Box
            key={series.id}
            display="flex"
            alignItems="center"
            sx={{ minWidth: 100 }}
          >
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
    </Box>
  )
}

export default LineChart
