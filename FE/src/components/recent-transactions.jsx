"use client"

import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

export function RecentTransactions({ recentTransactions }) {
  console.log(recentTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const filteredTransactions = recentTransactions?.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  console.log("filteredTransactions",filteredTransactions)

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions?.length > 0 ? (
                filteredTransactions?.map((transaction) => (
                  <TableRow key={transaction?.id}>
                    <TableCell className="font-medium">{transaction.date}</TableCell>
                    <TableCell>{transaction?.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction?.type === "income" ? "outline" : "secondary"}
                        className={
                          transaction.type === "income"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-50 hover:text-rose-700 dark:bg-rose-950 dark:text-rose-400 dark:hover:bg-rose-950 dark:hover:text-rose-400"
                        }
                      >
                        {transaction?.category?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`flex items-center justify-end ${transaction?.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpIcon className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="mr-1 h-4 w-4" />
                        )}
                        ${transaction?.amount?.toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
