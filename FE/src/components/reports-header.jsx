"use client"

import { useState } from "react"
import { CalendarIcon, DownloadIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CSVLink } from 'react-csv'
import { jsPDF } from 'jspdf'

export function ReportsHeader() {
  const [date, setDate] = useState(new Date())
  const [exportData, setExportData] = useState([])
  const [showCalendar, setShowCalendar] = useState(false);

  const handleExport = () => {
    // Assuming we have a function to fetch data for the selected date
    // This is a placeholder for actual data fetching logic
    const dummyData = [
      { date: format(date, "yyyy-MM-dd"), amount: 100, category: "Food" },
      { date: format(date, "yyyy-MM-dd"), amount: 200, category: "Transport" },
      { date: format(date, "yyyy-MM-dd"), amount: 300, category: "Utilities" },
    ]
    setExportData(dummyData)
  }

  const handleDownloadCSV = () => {
    const csvContent = Object.keys(exportData[0]).join(",") + "\n" + exportData.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    exportData.forEach((row, index) => {
      doc.text(`Date: ${row.date}, Amount: ${row.amount}, Category: ${row.category}`, 10, 10 + (index * 10));
    });
    doc.save("export.pdf");
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-slate-500 dark:text-slate-400">Analyze your financial data with detailed reports</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "MMMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
          <Calendar 
  selectedDate={date}
  onDateChange={(newDate) => {
    if (newDate) {
      setDate(newDate)
      setShowCalendar(false)
    }
  }} 
  onClose={() => setShowCalendar(false)} 
/>

          </PopoverContent>
        </Popover>
        <div className="flex gap-2">
           <Button variant="outline">
             <CSVLink data={exportData} filename="export.csv" className="button">
              Export
             </CSVLink>
         </Button> 

          <Button variant="outline" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
