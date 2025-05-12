"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export function DashboardHeader() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const getDateText = () => {
    if (!selectedDate) return "Select date"
    return format(selectedDate, "MMM d, yyyy")
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's an overview of your finances.</p>
      </div>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDateText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar 
            onDateChange={handleDateChange}
            onClose={() => setIsCalendarOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
