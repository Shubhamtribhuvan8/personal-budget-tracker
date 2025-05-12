"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const data = [
  { month: "Jan", income: 3200, expenses: 2100, savings: 1100 },
  { month: "Feb", income: 3300, expenses: 2200, savings: 1100 },
  { month: "Mar", income: 3400, expenses: 2300, savings: 1100 },
  { month: "Apr", income: 3500, expenses: 2400, savings: 1100 },
  { month: "May", income: 4550, expenses: 2345, savings: 2205 },
  { month: "Jun", income: 4600, expenses: 2500, savings: 2100 },
  { month: "Jul", income: 4650, expenses: 2550, savings: 2100 },
  { month: "Aug", income: 4700, expenses: 2600, savings: 2100 },
  { month: "Sep", income: 4750, expenses: 2650, savings: 2100 },
  { month: "Oct", income: 4800, expenses: 2700, savings: 2100 },
  { month: "Nov", income: 4850, expenses: 2750, savings: 2100 },
  { month: "Dec", income: 4900, expenses: 2800, savings: 2100 },
]

export function MonthlyTrends() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.income, d.expenses, d.savings))])
      .nice()
      .range([height, 0]);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y).tickFormat(d => `$${d}`));

    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat("")
        .ticks(5))
      .style("stroke-dasharray", "3 3")
      .style("opacity", 0.3);

    // Add lines
    const addLines = (key, color) => {
      svg.append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(d => x(d.month))
          .y(d => y(d[key]))
        )
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("fill", "none");
    };

    addLines("income", "#10b981");
    addLines("expenses", "#f43f5e");
    addLines("savings", "#3b82f6");

  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Annual Financial Trends</CardTitle>
        <CardDescription>Your income, expenses, and savings over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      </CardContent>
    </Card>
  )
}
