"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const data = [
  { month: "Jan", income: 3200, expenses: 2100 },
  { month: "Feb", income: 3300, expenses: 2200 },
  { month: "Mar", income: 3400, expenses: 2300 },
  { month: "Apr", income: 3500, expenses: 2400 },
  { month: "May", income: 4550, expenses: 2345 },
  { month: "Jun", income: 4600, expenses: 2500 },
]

export function IncomeVsExpenses() {
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
      .domain([0, d3.max(data, d => Math.max(d.income, d.expenses))])
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

    // Add bars
    const addBars = (key, color) => {
      svg.selectAll(`.bar-${key}`)
        .data(data)
        .join("rect")
        .attr("class", `bar-${key}`)
        .attr("x", d => x(d.month) + (key === "income" ? 0 : x.bandwidth() / 2))
        .attr("y", d => y(d[key]))
        .attr("width", x.bandwidth() / 2)
        .attr("height", d => height - y(d[key]))
        .attr("fill", color)
        .attr("rx", 4);
    };

    addBars("income", "#10b981");
    addBars("expenses", "#f43f5e");

  }, []);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Monthly comparison of your income and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      </CardContent>
    </Card>
  )
}
