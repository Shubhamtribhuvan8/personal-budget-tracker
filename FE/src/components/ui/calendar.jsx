"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

const Calendar = ({ onDateChange, onClose }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState(null)
  const [lastClickedDay, setLastClickedDay] = React.useState(null)
  const [lastClickTime, setLastClickTime] = React.useState(null)
  const calendarRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const months = [
    "January",
    "February", 
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
    const currentTime = new Date().getTime()

    if (
      lastClickedDay === day &&
      lastClickTime &&
      currentTime - lastClickTime < 300
    ) {
      onClose()
      return
    }

    setLastClickedDay(day)
    setLastClickTime(currentTime)

    setSelectedDate(clickedDate)
    onDateChange(clickedDate)
    onClose()
  }

  const isSameDay = (date1, date2) =>
    date1 &&
    date2 &&
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()

  return (
    <div
      ref={calendarRef}
      className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-[447px] z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-normal">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <Button variant="ghost" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          )
          const isSelected = isSameDay(date, selectedDate)

          return (
            <Button
              key={day}
              variant="ghost"
              className={`h-10 rounded-full ${
                isSelected ? "bg-gray-200 text-gray-900 font-bold" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
