"use client"

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"

const data = [
  {
    name: "Housing",
    budget: 1200,
    spent: 1150,
  },
  {
    name: "Food", 
    budget: 600,
    spent: 520,
  },
  {
    name: "Transport",
    budget: 400,
    spent: 380,
  },
  {
    name: "Utilities",
    budget: 300,
    spent: 290,
  },
  {
    name: "Entertainment",
    budget: 200,
    spent: 250,
  },
]

export function BudgetOverview() {
  const svgRef = useRef(null);
  const totalBudget = data.reduce((acc, item) => acc + item.budget, 0)
  const totalSpent = data.reduce((acc, item) => acc + item.spent, 0)
  const percentage = Math.round((totalSpent / totalBudget) * 100)

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Set dimensions
    const width = 600;
    const height = 240;
    const radius = Math.min(width, height) / 2;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create pie chart layout
    const pie = d3.pie()
      .value(d => d.spent)
      .sort(null);

    // Generate arc
    const arc = d3.arc()
      .innerRadius(radius * 0.5) // Create donut chart
      .outerRadius(radius * 0.8);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']);

    // Add tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-white p-2 rounded shadow-lg text-xs border border-gray-200")
      .style("pointer-events", "none");

    // Create pie chart segments
    const paths = svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`${d.data.name}<br/>Spent: $${d.data.spent}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
          .attr("class", "absolute block bg-white p-2 rounded shadow-lg text-xs border border-gray-200");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0)
          .attr("class", "absolute hidden bg-white p-2 rounded shadow-lg text-xs border border-gray-200");
      });

    // Add labels
    const labels = svg.selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .text(d => d.data.name);

  }, []);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Your monthly budget vs. actual spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Budget</span>
              <span className="text-sm font-medium">{percentage}% used</span>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>${totalSpent.toLocaleString()} spent</span>
              <span>${totalBudget.toLocaleString()} budgeted</span>
            </div>
          </div>
          <div className="h-[240px]">
            <svg ref={svgRef} className="w-full h-full"></svg>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {data.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded" style={{backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'][i]}}></div>
                <span className="text-xs">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
