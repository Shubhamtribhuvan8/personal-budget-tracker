"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const data = [
  { name: "Housing", value: 1150, color: "#10b981" },
  { name: "Food", value: 520, color: "#3b82f6" },
  { name: "Transport", value: 380, color: "#6366f1" },
  { name: "Utilities", value: 290, color: "#8b5cf6" },
  { name: "Entertainment", value: 250, color: "#ec4899" },
  { name: "Other", value: 180, color: "#f43f5e" },
]

export function ExpensesByCategory() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Set dimensions
    const width = 600;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create pie chart layout
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    // Generate arc
    const arc = d3.arc()
      .innerRadius(radius * 0.5) // Create donut chart
      .outerRadius(radius * 0.8);

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-white p-2 rounded shadow-lg text-xs border border-gray-200")
      .style("pointer-events", "none");

    // Add pie chart segments
    const segments = svg.selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", d => d.data.color)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`${d.data.name}: $${d.data.value}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0);
      });

    // Add legend
    const legend = svg.selectAll("text")
      .data(data)
      .join("text")
      .attr("x", width / 2)
      .attr("y", (d, i) => height / 2 + i * 20)
      .text(d => `${d.name}: $${d.value}`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", d => d.color);
  }, []);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Breakdown of your spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      </CardContent>
    </Card>
  )
}
