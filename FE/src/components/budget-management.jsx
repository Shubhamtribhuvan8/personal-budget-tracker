"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { budgetService } from "../apis/budgetService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function BudgetManagement() {
  const svgRef = useRef(null);
  const [budgetData, setBudgetData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() // 0-11
  const currentYear = currentDate.getFullYear()
  
  // Get the last 6 months data, including current month
  useEffect(() => {
    fetchBudgetData()
  }, [selectedYear])
  
  const fetchBudgetData = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const monthsData = []
      
      // Determine months to fetch based on selected year
      let startMonth = 1
      let endMonth = 12
      
      // If it's current year, only fetch up to current month
      if (selectedYear === currentYear) {
        endMonth = currentMonth + 1 // Convert from 0-indexed to 1-indexed
      }
      
      // For each month in range, fetch budget data
      for (let month = startMonth; month <= endMonth; month++) {
        const result = await budgetService.getBudgets(month, selectedYear)
        
        if (result.success) {
          const budgets = Array.isArray(result.data) ? result.data : (result.data.budgets || [])
          
          // Sum up total budget and spent amounts
          const totalBudget = budgets.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
          const totalSpent = budgets.reduce((sum, item) => sum + parseFloat(item.spent || 0), 0)
          
          const monthName = new Date(selectedYear, month - 1, 1).toLocaleString('default', { month: 'short' })
          
          monthsData.push({
            month: monthName,
            budget: totalBudget,
            spent: totalSpent
          })
        }
      }
      
      setBudgetData(monthsData)
    } catch (err) {
      setError("Error loading budget data")
      console.error("Budget data fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Generate chart when data changes
  useEffect(() => {
    if (!svgRef.current || budgetData.length === 0) return;

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
      .domain(budgetData.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(budgetData, d => Math.max(d.budget, d.spent)) * 1.1]) // Add 10% padding
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
        .data(budgetData)
        .join("rect")
        .attr("class", `bar-${key}`)
        .attr("x", d => x(d.month) + (key === "budget" ? 0 : x.bandwidth() / 2))
        .attr("y", d => y(d[key]))
        .attr("width", x.bandwidth() / 2)
        .attr("height", d => height - y(d[key]))
        .attr("fill", color)
        .attr("rx", 4);
    };

    addBars("budget", "#94a3b8");
    addBars("spent", "#10b981");

    // Add legend
    const legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(["Budget", "Spent"])
      .join("g")
      .attr("transform", (d, i) => `translate(${width - 20}, ${i * 20})`);

    legend.append("rect")
      .attr("x", -17)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d, i) => i === 0 ? "#94a3b8" : "#10b981")
      .attr("rx", 2);

    legend.append("text")
      .attr("x", -24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d);

  }, [budgetData]);

  // Get current month's budget data for the summary section
  const getCurrentMonthData = () => {
    if (budgetData.length === 0) {
      return { budget: 0, spent: 0 }
    }
    
    // Find current month's data
    const currentMonthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'short' })
    const monthData = budgetData.find(d => d.month === currentMonthName) || budgetData[budgetData.length - 1]
    
    return monthData
  }

  const currentMonthData = getCurrentMonthData()
  const percentage = currentMonthData.budget > 0 ? 
    Math.round((currentMonthData.spent / currentMonthData.budget) * 100) : 0
  const remaining = currentMonthData.budget - currentMonthData.spent

  // Generate years for the selector (last 5 years)
  const yearOptions = []
  for (let i = 0; i < 5; i++) {
    yearOptions.push(currentYear - i)
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Monthly Budget</CardTitle>
            <CardDescription>Your budget performance over time</CardDescription>
          </div>
          <div className="w-32">
            <Select 
              value={selectedYear.toString()} 
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger id="year-select">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Month Budget</span>
            <span className="text-sm font-medium">{percentage}% used</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              ${currentMonthData.spent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} spent
            </span>
            <span className="font-medium">
              ${remaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} remaining
            </span>
          </div>
        </div>

        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading budget data...
            </div>
          ) : budgetData.length > 0 ? (
            <svg ref={svgRef} className="w-full h-full"></svg>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No budget data available for {selectedYear}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}