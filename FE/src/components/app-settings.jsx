"use client"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Label from "./ui/label"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function AppSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>Customize your budget tracker experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select defaultValue="usd">
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD ($)</SelectItem>
              <SelectItem value="eur">EUR (€)</SelectItem>
              <SelectItem value="gbp">GBP (£)</SelectItem>
              <SelectItem value="jpy">JPY (¥)</SelectItem>
              <SelectItem value="cad">CAD ($)</SelectItem>
              <SelectItem value="aud">AUD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-format">Date Format</Label>
          <Select defaultValue="mm-dd-yyyy">
            <SelectTrigger id="date-format">
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
              <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
              <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Email Notifications</Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">Receive email alerts for budget limits</p>
          </div>
          <Switch id="notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-report">Weekly Report</Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">Receive weekly summary of your finances</p>
          </div>
          <Switch id="weekly-report" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
