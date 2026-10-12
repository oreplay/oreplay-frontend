import React from "react"
import { ResponsiveLine } from "@nivo/line"
import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import {
  LineChartData,
  ChartDataPoint,
  formatTime,
  formatTimeDifference,
  getLineChartTicks,
} from "../../../../shared/chartDataTransform.ts"
import { getAccessibleColors } from "../../../../../../../../../../utils/accessibleColors.ts"
import { visibleAxisLabelIndexes } from "../../shared/axisLabels.ts"
import {
  CHART_RIGHT_MARGIN_PX,
  CHART_TOP_MARGIN_PX,
  plotWidthPx,
  verticalAxisMarginPx,
} from "../../shared/chartLayout.ts"
import useElementWidth from "../../shared/useElementWidth.ts"

interface LineChartProps {
  data: LineChartData[]
  height?: number
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 400 }) => {
  const { t } = useTranslation()
  const [chartRef, chartWidth] = useElementWidth<HTMLDivElement>()

  const accessibleColors = getAccessibleColors(data.length)
  const dataWithColors = data.map((series, index) => ({
    ...series,
    color: accessibleColors[index],
  }))
  const ticks = getLineChartTicks(data)
  const tickValues = ticks.map((tick) => tick.value)
  const longestTime = Math.max(0, ...data.flatMap((series) => series.data.map((point) => point.y)))
  const leftMargin = verticalAxisMarginPx([formatTime(longestTime)])
  const labelledTickIndexes = visibleAxisLabelIndexes(
    tickValues,
    plotWidthPx(chartWidth, leftMargin, CHART_RIGHT_MARGIN_PX),
  )
  const tickLabelByValue = new Map(
    ticks
      .filter((_, index) => labelledTickIndexes.has(index))
      .map((tick) => [tick.value, tick.label]),
  )

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height,
          bgcolor: "grey.50",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, textAlign: "center" }}>
          {t("lineChart.noData")}
        </Typography>
      </Box>
    )
  }

  return (
    <Box ref={chartRef} sx={{ height, width: "100%" }}>
      <ResponsiveLine
        data={dataWithColors}
        margin={{
          top: CHART_TOP_MARGIN_PX,
          right: CHART_RIGHT_MARGIN_PX,
          bottom: 50,
          left: leftMargin,
        }}
        xScale={{ type: "linear", min: "auto", max: "auto", nice: false }}
        gridXValues={tickValues}
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
          tickValues,
          format: (value) => tickLabelByValue.get(Number(value)) ?? "",
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
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                {data.runnerName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {t("lineChart.tooltip.behindLeader")}: {formatTimeDifference(data.timeBehindLeader)}
              </Typography>
              <Typography variant="body2">
                {t("lineChart.tooltip.behindPerfectRunner")}:{" "}
                {formatTimeDifference(data.timeBehindPerfectRunner)}
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
