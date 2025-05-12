"use client"

import * as React from "react"

const ChartContainer = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
ChartLegend.displayName = "ChartLegend"

const ChartLegendContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
ChartLegendContent.displayName = "ChartLegendContent"

const ChartStyle = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
ChartStyle.displayName = "ChartStyle"

const Chart = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />)
Chart.displayName = "Chart"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle }
