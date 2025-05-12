"use client"

import React, { useState } from "react"
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from "react-router-dom"
import { BarChart3, ChevronDown, ChevronRight, CreditCard, DollarSign, Home, LogOut, PieChart, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"

const NavItem = ({ icon: Icon, label, href, isCollapsed, isActive }) => {


  const navigate = useNavigate()

  return (
    <div
      className={`flex items-center justify-between pl-4 pr-8 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-[var(--Accent,#00E6B5)] hover:text-gray-900 cursor-pointer ${
        isActive ? "bg-[var(--Accent,#00E6B5)] text-gray-900" : ""
      }`}
      onClick={() => navigate(href)}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} strokeWidth={1.5} />
        {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
      </div>
    </div>
  )
}

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth();
  

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Transactions", 
      icon: CreditCard,
      href: "/dashboard/transactions",
    },
    {
      title: "Budget",
      icon: DollarSign, 
      href: "/dashboard/budget",
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/dashboard/reports", 
    },
    {
      title: "Categories",
      icon: PieChart,
      href: "/dashboard/categories",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  const handleLogout = () => {
    navigate("/")
  }

  return (
    <aside
      className={`bg-white shadow-lg flex flex-col h-screen transition-all duration-300 ${
        isCollapsed ? "w-[70px]" : "w-[250px]"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="p-6 flex items-center">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">BudgetTracker</span>
          </div>
        )}
        <ChevronRight
          size={20}
          className={`text-gray-400 transition-transform duration-300 ${
            isCollapsed ? "rotate-0" : "rotate-180"
          } ml-auto`}
        />
      </div>

      <nav className="flex-grow space-y-1 p-4">
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.title}
            href={item.href}
            isCollapsed={isCollapsed}
            isActive={location.pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
            <AvatarFallback><svg
  width="64"
  height="64"
  viewBox="0 0 64 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle cx="32" cy="32" r="32" fill="#E0E0E0" />
  <circle cx="32" cy="24" r="12" fill="#BDBDBD" />
  <path
    d="M16 52c0-8.837 7.163-16 16-16s16 7.163 16 16"
    fill="#BDBDBD"
  />
</svg>
</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate"> {currentUser?.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email } = useAuth();
              </span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${isCollapsed ? "px-2" : ""}`}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  )
}
