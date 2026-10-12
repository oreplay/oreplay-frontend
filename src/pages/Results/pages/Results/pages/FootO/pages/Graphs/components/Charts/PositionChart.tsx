import React from "react"
import { ResponsiveLine } from "@nivo/line"
import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import {
  formatTime,
  getLineChartTicks,
  PositionChartData,
  PositionDataPoint,
} from "../../../../shared/chartDataTransform.ts"
import { getAccessibleColors } from "../../../../../../../../../../utils/accessibleColors.ts"
import { visibleAxisLabelIndexes } from "../../shared/axisLabels.ts"
import {
  CHART_RIGHT_MARGIN_PX,
  CHART_TOP_MARGIN_PX,
  plotWidthPx,
  verticalAxisMarginPx,
} from "../../shared/chartLayout.ts"
import { positionLabel } from "../../shared/positionChartAxis.ts"
import useElementWidth from "../../shared/useElementWidth.ts"

interface PositionChartProps {
  data: PositionChartData[]
  height?: number
}

const PositionChart: React.FC<PositionChartProps> = ({ data, height = 400 }) => {
  const { t } = useTranslation()
  const [chartRef, chartWidth] = useElementWidth<HTMLDivElement>()

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

  const allYValues = dataWithColors.flatMap((runner) => runner.data.map((point) => point.y))
  const dynamicMaxY = Math.max(...allYValues)

  // Tick step logic
  const tickStep = dynamicMaxY <= 10 ? 1 : dynamicMaxY <= 20 ? 2 : 5

  const yTickValues = []
  for (let i = 1; i <= dynamicMaxY; i += tickStep) {
    yTickValues.push(i)
  }
  if (yTickValues[yTickValues.length - 1] !== dynamicMaxY) {
    yTickValues.push(dynamicMaxY)
  }

  const positionLabels = yTickValues.map(positionLabel)
  const leftMargin = verticalAxisMarginPx(positionLabels)
  const ticks = getLineChartTicks(data)
  const tickValues = ticks.map((tick) => tick.value)
  const labelledTickIndexes = visibleAxisLabelIndexes(
    tickValues,
    plotWidthPx(chartWidth, leftMargin, CHART_RIGHT_MARGIN_PX),
  )
  const tickLabelByValue = new Map(
    ticks
      .filter((_, index) => labelledTickIndexes.has(index))
      .map((tick) => [tick.value, tick.label]),
  )

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
          min: 1,
          max: dynamicMaxY,
          reverse: true,
          nice: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          tickValues,
          format: (value) => tickLabelByValue.get(Number(value)) ?? "",
          legend: t("positionChart.xAxisLabel"),
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: (value) => positionLabel(Number(value)),
          tickValues: yTickValues,
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
                {t("positionChart.tooltip.control")}: {data.controlName}
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {t("positionChart.tooltip.position")}: {Math.round(data.y)}°
              </Typography>

              {data.splitTime > 0 && (
                <Typography
                  variant="body2"
                  sx={{ mb: 0.5, fontWeight: data.timeLost <= 0 ? "bold" : "normal" }}
                >
                  {t("positionChart.tooltip.splitTime")}: {formatTime(data.splitTime)}
                </Typography>
              )}

              {data.timeLost > 0 && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {t("positionChart.tooltip.timeLost", {
                    timeLost: `+${formatTime(data.timeLost)}`,
                  })}
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
  )
}

export default PositionChart
