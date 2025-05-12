import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Chart = () => {
  const svgRef = useRef(null);
  
  // Sample data
  const data = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 50 },
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 70 },
    { month: 'May', value: 65 },
    { month: 'Jun', value: 85 },
    { month: 'Jul', value: 75 },
    { month: 'Aug', value: 90 },
    { month: 'Sep', value: 80 },
    { month: 'Oct', value: 100 },
    { month: 'Nov', value: 95 },
    { month: 'Dec', value: 110 }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.2);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height, 0]);
    
    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("class", "text-xs fill-muted-foreground");
    
    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("class", "text-xs fill-muted-foreground");
    
    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "rgba(203, 213, 225, 0.2)");
    
    // Create a tooltip div
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-white p-2 rounded shadow-lg text-xs border border-gray-200")
      .style("pointer-events", "none");
    
    // Add bars
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", "#3b82f6")
      .attr("rx", 4)
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html(`Month: ${d.month}<br/>Value: ${d.value}`)
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
    
    // Add chart title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-medium")
      .text("Monthly Performance");
    
    // Add X axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs fill-muted-foreground")
      .text("Month");
    
    // Add Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs fill-muted-foreground")
      .text("Value");
    
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <svg ref={svgRef} className="w-full h-full max-h-96"></svg>
      <div className="flex justify-center gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded"></div>
            <span className="text-xs">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default D3Chart;